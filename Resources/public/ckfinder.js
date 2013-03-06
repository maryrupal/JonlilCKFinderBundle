﻿/*
 Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.html or http://ckeditor.com/license
 */
(function() {
    var a = (function() {
        var f = {
                jY: 'D03E1XW',
                _: {},
                status: 'unloaded',
                basePath: (function() {
                    var i = window.CKFINDER_BASEPATH || '';
                    if (!i) {
                        var j = document.getElementsByTagName('script');
                        for (var k = 0; k < j.length; k++) {
                            var l = j[k].src.match(/(^|.*[\\\/])CKFINDER(?:_basic)?(?:_v2)?(?:_source)?.js(?:\?.*)?$/i);
                            if (l) {
                                i = l[1];
                                break;
                            }
                        }
                    }
                    if (i.indexOf('://') == -1) if (i.indexOf('/') === 0) i = location.href.match(/^.*?:\/\/[^\/]*/)[0] + i;
                    else i = location.href.match(/^[^\?]*\/(?:)/)[0] + i;
                    return i;
                })(),
                getUrl: function(i) {
                    if (i.indexOf('://') == -1 && i.indexOf('/') !== 0) i = this.basePath + i;
                    if (this.jY && i.charAt(i.length - 1) != '/') i += (i.indexOf('?') >= 0 ? '&' : '?') + 't=' + this.jY;
                    return i;
                }
            },
            g = window.CKFINDER_GETURL;
        if (g) {
            var h = f.getUrl;
            f.getUrl = function(i) {
                return g.call(f, i) || h.call(f, i);
            };
        }
        return f;
    })();

    function b(f) {
        return a.instances[f];
    };
    var c = {
        callback: 1,
        selectThumbnailActionFunction: 1,
        selectActionFunction: 1
    };
    a.jd = function() {
        var h = this;
        var f = {};
        for (var g in h) {
            if (!h.hasOwnProperty(g)) continue;
            if (typeof h[g] == 'function' && !c[g] || typeof h[g] == 'undefined') continue;
            f[g] = h[g];
        }
        if (h.callback) f.callback = h.callback;
        return f;
    };
    a.lj = function(f) {
        var i = this;
        f = f || i.basePath;
        var g = '';
        if (!f || f.length === 0) f = CKFinder.DEFAULT_basePath;
        if (f.substr(f.length - 1, 1) != '/') f += '/';
        f += 'ckfinder.html';
        var h;
        if (i.hh) {
            h = i.hh;
            if (typeof h == 'function') h = h.toString().match(/function ([^(]+)/)[1];
            g += '?action=js&amp;func=' + h;
        }
        if (i.jx) {
            g += g ? '&amp;' : '?';
            g += 'data=' + encodeURIComponent(i.jx);
        }
        if (i.disableThumbnailSelection) {
            g += g ? '&amp;' : '?';
            g += 'dts=1';
        } else if (i.lH || i.hh) {
            h = i.lH || i.hh;
            if (typeof h == 'function') h = h.toString().match(/function ([^(]+)/)[1];
            g += g ? '&amp;' : '?';
            g += 'thumbFunc=' + h;
            if (i.nm) g += '&amp;tdata=' + encodeURIComponent(i.nm);
            else if (!i.lH && i.jx) g += '&amp;tdata=' + encodeURIComponent(i.jx);
        }
        if (i.startupPath) {
            g += g ? '&amp;' : '?';
            g += 'start=' + encodeURIComponent(i.startupPath + (i.startupFolderExpanded ? ':1' : ':0'));
        }
        if (i.rememberLastFolder !== undefined && !i.rememberLastFolder) {
            g += g ? '&amp;' : '?';
            g += 'rlf=0';
        }
        if (i.id) {
            g += g ? '&amp;' : '?';
            g += 'id=' + encodeURIComponent(i.id);
        }
        if (i.skin) {
            g += g ? '&amp;' : '?';
            g += 'skin=' + encodeURIComponent(i.skin);
        }
        return f + g;
    };

    function d(f) {
        var i = this;
        i.id = f.name;
        var g = f.element.getDocument().getWindow().$,
            h = a.oC.getWindow().$;
        i.inPopup = !!(g && g.opener);
        i.inIframe = !i.inPopup && g != h.top && g.frameElement.nodeName.toLowerCase() == 'iframe';
        i.inFrame = !i.inPopup && g != h.top && g.frameElement.nodeName.toLowerCase() == 'frame';
        i.inUrlPopup = !!(i.inPopup && h.opener);
    };

    function e(f, g, h) {
        g.on('appReady', function(i) {
            i.removeListener();
            f.document = g.document.$;
            f.folders = g.folders;
            f.files = g.aG['filesview.filesview'].data().files;
            f.basketFiles = g.basketFiles;
            f.resourceTypes = g.resourceTypes;
            f.connector = g.connector;
            f.lang = g.lang;
            f.langCode = g.langCode;
            f.config = g.config;
            g.aG['foldertree.foldertree'].on('afterAddFolder', function(j) {
                j.removeListener();
                if (h) h(f);
            }, f);
        }, f, null, 999);
    };
    d.prototype = {
        _: {},
        addFileContextMenuOption: function(f, g, h) {
            var i = b(this.id),
                j = 'FileContextMenu_' + f.command;
            i.bD(j, {
                exec: function(k) {
                    var l = k.aG['filesview.filesview'].tools.dH();
                    g(k.cg, l);
                }
            });
            f.command = j;
            if (!f.group) f.group = 'file1';
            i.gp(j, f);
            i.aG['filesview.filesview'].on('beforeContextMenu', function m(k) {
                if (h) {
                    var l = h(this.tools.dH());
                    if (l) k.data.bj[j] = l == -1 ? a.aY : a.aS;
                } else k.data.bj[j] = a.aS;
            });
        },
        disableFileContextMenuOption: function(f, g) {
            var h = b(this.id),
                i = g ? 'FileContextMenu_' + f : f,
                j = function l(k) {
                    delete k.data.bj[i];
                };
            h.aG['filesview.filesview'].on('beforeContextMenu', j);
            return function() {
                h.aG['filesview.filesview'].removeListener('beforeContextMenu', j);
            };
        },
        addFolderContextMenuOption: function(f, g, h) {
            var i = b(this.id),
                j = 'FolderContextMenu_' + f.command;
            i.bD(j, {
                exec: function(k) {
                    g(k.cg, k.aV);
                }
            });
            f.command = j;
            if (!f.group) f.group = 'folder1';
            i.gp(j, f);
            i.aG['foldertree.foldertree'].on('beforeContextMenu', function m(k) {
                if (h) {
                    var l = h(this.app.aV);
                    if (l) k.data.bj[j] = l == -1 ? a.aY : a.aS;
                } else k.data.bj[j] = a.aS;
            });
        },
        disableFolderContextMenuOption: function(f, g) {
            var h = b(this.id),
                i = g ? 'FolderContextMenu_' + f : f,
                j = function l(k) {
                    delete k.data.bj[i];
                };
            h.aG['foldertree.foldertree'].on('beforeContextMenu', j);
            return function() {
                h.aG['foldertree.foldertree'].removeListener('beforeContextMenu', j);
            };
        },
        addFolderDropMenuOption: function(f, g, h) {
            var i = b(this.id),
                j = 'FolderDropMenu_' + f.command;
            i.bD(j, {
                exec: function(l) {
                    g(l.cg, l.cK.oa());
                }
            });
            f.command = j;
            var k = new a.iD(i, j, f);
            i.aG['foldertree.foldertree'].on('beforeDropMenu', function m(l) {
                if (h ? h.call(i.cg, l.data.folder) : 1) l.data.iG[j] = k;
            });
        },
        disableFolderDropMenuOption: function(f, g) {
            var h = b(this.id),
                i = g ? 'FolderDropMenu_' + f : f,
                j = function l(k) {
                    delete k.data.iG[i];
                };
            h.aG['foldertree.foldertree'].on('beforeDropMenu', j);
            return function() {
                h.aG['foldertree.foldertree'].removeListener('beforeDropMenu', j);
            };
        },
        getSelectedFile: function() {
            return b(this.id).aG['filesview.filesview'].tools.dH();
        },
        getSelectedFiles: function() {
            return b(this.id).aG['filesview.filesview'].tools.oO();
        },
        getSelectedFolder: function() {
            return b(this.id).aV;
        },
        setUiColor: function(f) {
            return b(this.id).setUiColor(f);
        },
        destroy: function(f) {
            b(this.id).destroy();
            f && f();
        },
        openDialog: function(f, g) {
            var j = this;
            var h = new a.dom.document(window.document).getHead(),
                i = b(j.id).document.getWindow();
            if (j.inFrame || j.inPopup || j.inIframe) a.document = b(j.id).document;
            return b(j.id).openDialog(f, g, h);
        },
        openMsgDialog: function(f, g) {
            b(this.id).msgDialog(f, g);
        },
        openConfirmDialog: function(f, g, h) {
            b(this.id).fe(f, g, h);
        },
        openInputDialog: function(f, g, h, i) {
            b(this.id).hs(f, g, h, i);
        },
        openSkippedFilesDialog: function(f, g, h, i) {
            b(this.id).skippedFilesDialog(f, g, h, i);
        },
        addTool: function(f) {
            return b(this.id).plugins.tools.addTool(f);
        },
        addToolPanel: function(f) {
            return b(this.id).plugins.tools.addToolPanel(f);
        },
        removeTool: function(f) {
            b(this.id).plugins.tools.removeTool(f);
        },
        showTool: function(f) {
            b(this.id).plugins.tools.showTool(f);
        },
        hideTool: function(f) {
            b(this.id).plugins.tools.hideTool(f);
        },
        getResourceType: function(f) {
            return b(this.id).getResourceType(f);
        },
        log: function(f) {
            a.log.apply(a.log, arguments);
        },
        getLog: function() {
            return a.mZ();
        },
        emptyBasket: function() {
            b(this.id).execCommand('TruncateBasket');
        },
        replaceUploadForm: function(f, g, h, i) {
            var j = b(this.id);
            if (!i) i = 10;
            if (i >= (j.dC || 20)) return;
            j.dC = i;
            j.aG['formpanel.formpanel'].on('beforeUploadFileForm', function(k) {
                if (k.data.step != 2) return;
                if (i > j.dC) return;
                k.cancel(true);
                var l = this.data(),
                    m = k.data.folder;
                try {
                    if (l.dc == 'upload') this.oW('requestUnloadForm', function() {
                        this.app.cS('upload').bR(a.aS);
                    });
                    else {
                        if (this.data().dc) this.oW('requestUnloadForm');
                        if (!h) this.eh.removeClass('show_border');
                        this.oW('requestLoadForm', {
                            html: f,
                            command: 'upload'
                        });
                        g && g();
                    }
                } catch (n) {
                    this.oW('failedUploadFileForm', k.data);
                    this.oW('afterUploadFileForm', k.data);
                    throw a.ba(n);
                }
            });
            return {
                hide: function() {
                    j.oW('requestUnloadForm', function() {
                        j.cS('upload').bR(a.aS);
                    });
                }
            };
        },
        resizeFormPanel: function(f) {
            var g = b(this.id);
            if (typeof f == 'undefined') {
                g.document.getById('panel_view').setStyle('height', '');
                g.document.getById('panel_widget').setStyle('height', '');
            } else {
                var h = Math.min(f, Math.max(90, g.document.getById('main_container').$.offsetHeight - 300));
                g.document.getById('panel_view').setStyle('height', h + 'px');
                g.document.getById('panel_widget').setStyle('height', h - 3 + 'px');
            }
            g.layout.ea(true);
        },
        refreshOpenedFolder: function() {
            var f = b(this.id),
                g = f.aG['filesview.filesview'].tools.currentFolder();
            f.oW('requestSelectFolder', {
                folder: g
            });
        },
        selectFile: function(f) {
            var g = b(this.id);
            g.oW('requestSelectFile', {
                file: f,
                scrollTo: 1
            });
        },
        closePopup: function() {
            if (!this.inPopup) return;
            b(this.id).element.getDocument().getWindow().$.close();
        },
        openFolder: function(f, g) {
            var h = b(this.id);
            g = g.replace(/\/$/, '');
            f = f.toLowerCase();
            for (var i = 0; i < h.folders.length; i++) {
                var j = h.folders[i];
                if (j.getPath().replace(/\/$/, '') == g && f == j.type.toLowerCase()) {
                    h.oW('requestSelectFolder', {
                        folder: j
                    });
                    h.oW('requestShowFolderFiles', {
                        folder: j
                    });
                    return;
                }
            }
        },
        setUiColor: function(f) {
            b(this.id).setUiColor(f);
        },
        execCommand: function(f) {
            b(this.id).execCommand(f);
        }
    };
    (function() {
        window.CKFinder = function(g, h) {
            if (g) for (var i in g) {
                if (!g.hasOwnProperty(i)) continue;
                if (typeof g[i] == 'function' && i != 'callback') continue;
                this[i] = g[i];
            }
            this.callback = h;
        };

        function f(g) {
            var h = 1;
            while (CKFinder._.instanceConfig[h]) h++;
            CKFinder._.instanceConfig[h] = g;
            return h;
        };
        CKFinder.prototype = {
            create: function(g) {
                var h = 'ckf' + Math.random().toString().substr(2, 9);
                document.write('<span id="' + h + '"></span>');
                g = a.tools.extend(a.jd.call(this), g, true);
                var i = a.replace(h, g, CKFinder);
                this.api = i.cg;
                return i.cg;
            },
            appendTo: function(g, h) {
                h = a.tools.extend(a.jd.call(this), h, true);
                var i = a.appendTo(g, h, CKFinder);
                this.api = i.cg;
                return i.cg;
            },
            replace: function(g, h) {
                h = a.tools.extend(a.jd.call(this), h, true);
                var i = a.replace(g, h, CKFinder);
                this.api = i.cg;
                return i.cg;
            },
            popup: function(g, h) {
                var q = this;
                g = g || '80%';
                h = h || '70%';
                if (typeof g == 'string' && g.length > 1 && g.substr(g.length - 1, 1) == '%') g = parseInt(window.screen.width * parseInt(g, 10) / 100, 10);
                if (typeof h == 'string' && h.length > 1 && h.substr(h.length - 1, 1) == '%') h = parseInt(window.screen.height * parseInt(h, 10) / 100, 10);
                if (g < 200) g = 200;
                if (h < 200) h = 200;
                var i = parseInt((window.screen.height - h) / 2, 10),
                    j = parseInt((window.screen.width - g) / 2, 10),
                    k = 'location=no,menubar=no,toolbar=no,dependent=yes,minimizable=no,modal=yes,alwaysRaised=yes,resizable=yes,width=' + g + ',height=' + h + ',top=' + i + ',left=' + j,
                    l = a.env.webkit ? 'about:blank' : '',
                    m = window.open(l, 'CKFinderpopup', k, true);
                if (!m) return false;
                q.width = q.height = '100%';
                var n = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html><head><title>CKFinder 2</title><style type="text/css">body, html, iframe, #ckfinder { margin: 0; padding: 0; border: 0; width: 100%; height: 100%; overflow: hidden; }</style></head><body></body></html>',
                    o = new a.dom.document(m.document);
                o.$.open();
                if (a.env.isCustomDomain()) o.$.domain = window.document.domain;
                o.$.write(n);
                o.$.close();
                try {
                    var p = navigator.userAgent.toLowerCase();
                    if (p.indexOf(' chrome/') == -1) {
                        m.moveTo(j, i);
                        m.resizeTo(g, h);
                    }
                    m.focus();
                    return q.appendTo(o.bH());
                } catch (r) {
                    return q.appendTo(o.bH());
                }
                return false;
            }
        };
        CKFinder._ = {};
        CKFinder._.instanceConfig = [];
        CKFinder.lang = {};
        CKFinder.version = '2.3.1';
        CKFinder.revision = '2516';
        CKFinder.addPlugin = function(g, h, i) {
            var j = {
                bM: i || []
            };
            if (typeof h == 'function') h = {
                appReady: h
            };
            for (var k in h) {
                if (!h.hasOwnProperty(k)) continue;
                if (k != 'connectorInitialized' && k != 'uiReady') j[k] = h[k];
            }
            j.bz = function(l) {
                if (l.config.readOnly && j.readOnly === false) return null;
                if (h.connectorInitialized) l.on('connectorInitialized', function(m) {
                    var n = h.connectorInitialized;
                    if (n) n.call(n, l.cg, m.data.xml);
                }, null, null, 1000);
                if (h.connectorResponse) l.on('connectorResponse', function(m) {
                    var n = h.connectorResponse;
                    if (n) n.call(n, l.cg, m.data.xml);
                });
                if (h.galleryCallback) l.on('launchGallery', function(m) {
                    var n = h.galleryCallback;
                    if (n) m.data.bx = n.call(n, l.cg, m.data.selected, m.data.files);
                });
                if (h.uiReady) l.on('uiReady', function() {
                    var m = h.uiReady;
                    m.call(m, l.cg);
                }, null, null, 1000);
                if (h.appReady) l.on('appReady', function() {
                    var m = h.appReady;
                    m.call(m, l.cg);
                }, null, null, 1000);
            };
            a.plugins.add(g, j);
        };
        CKFinder.getPluginPath = function(g) {
            return a.plugins.getPath(g);
        };
        CKFinder.addExternalPlugin = function(g, h, i) {
            a.plugins.tR(g, h, i);
        };
        CKFinder.setPluginLang = function(g, h, i) {
            a.plugins.rX(g, h, i);
        };
        CKFinder.dialog = {
            add: function(g, h) {
                if (typeof h == 'function') h = a.tools.override(h, function(i) {
                    return function(j) {
                        return i(j.cg);
                    };
                });
                a.dialog.add(g, h);
            }
        };
        CKFinder.tools = {};
        CKFinder.env = {};
        CKFinder.dom = {};
        CKFinder.create = function(g, h, i, j, k) {
            var l;
            if (g !== null && typeof g === 'object') {
                l = new CKFinder();
                for (var m in g) l[m] = g[m];
            } else {
                l = new CKFinder();
                l.basePath = g;
                if (h) l.width = h;
                if (i) l.height = h;
                if (j) l.selectActionFunction = j;
                if (k) l.callback = k;
            }
            return l.create();
        };
        CKFinder.popup = function(g, h, i, j, k) {
            var l;
            if (g !== null && typeof g === 'object') {
                l = new CKFinder();
                for (var m in g) l[m] = g[m];
            } else {
                l = new CKFinder();
                l.basePath = g;
                if (j) l.selectActionFunction = j;
                if (k) l.callback = k;
            }
            return l.popup(h, i);
        };
        CKFinder.setupFCKeditor = function(g, h, i, j) {
            var k, l;
            if (h !== null && typeof h === 'object') {
                l = f(h);
                k = new CKFinder();
                for (var m in h) {
                    k[m] = h[m];
                    if (m == 'width') {
                        var n = k[m] || 800;
                        if (typeof n == 'string' && n.length > 1 && n.substr(n.length - 1, 1) == '%') n = parseInt(window.screen.width * parseInt(n, 10) / 100, 10);
                        g.Config.LinkBrowserWindowWidth = n;
                        g.Config.ImageBrowserWindowWidth = n;
                        g.Config.FlashBrowserWindowWidth = n;
                    } else if (m == 'height') {
                        var o = k[m] || 600;
                        if (typeof o == 'string' && o.length > 1 && o.substr(o.length - 1, 1) == '%') o = parseInt(window.screen.height * parseInt(o, 10) / 100, 10);
                        g.Config.LinkBrowserWindowHeight = o;
                        g.Config.ImageBrowserWindowHeight = o;
                        g.Config.FlashBrowserWindowHeight = o;
                    }
                }
            } else {
                k = new CKFinder();
                k.basePath = h;
            }
            var p = k.basePath;
            if (p.substr(0, 1) != '/' && p.indexOf('://') == -1) p = document.location.pathname.substring(0, document.location.pathname.lastIndexOf('/') + 1) + p;
            p = a.lj.call(k, p);
            var q = p.indexOf('?') !== -1 ? '&' : '?';
            if (l) {
                p += q + 'configId=' + l;
                q = '&';
            }
            g.Config.LinkBrowserURL = p;
            g.Config.ImageBrowserURL = p + q + 'type=' + (i || 'Images');
            g.Config.FlashBrowserURL = p + q + 'type=' + (j || 'Flash');
            var r = p.substring(0, 1 + p.lastIndexOf('/'));
            g.Config.LinkUploadURL = r + 'core/connector/' + CKFinder.config.connectorLanguage + '/connector.' + CKFinder.config.connectorLanguage + '?command=QuickUpload&type=Files';
            g.Config.ImageUploadURL = r + 'core/connector/' + CKFinder.config.connectorLanguage + '/connector.' + CKFinder.config.connectorLanguage + '?command=QuickUpload&type=' + (i || 'Images');
            g.Config.FlashUploadURL = r + 'core/connector/' + CKFinder.config.connectorLanguage + '/connector.' + CKFinder.config.connectorLanguage + '?command=QuickUpload&type=' + (j || 'Flash');
        };
        CKFinder.setupCKEditor = function(g, h, i, j) {
            if (g === null) {
                for (var k in CKEDITOR.instances) CKFinder.setupCKEditor(CKEDITOR.instances[k], h, i, j);
                CKEDITOR.on('instanceCreated', function(t) {
                    CKFinder.setupCKEditor(t.editor, h, i, j);
                });
                return;
            }
            var l, m;
            if (h !== null && typeof h === 'object') {
                m = f(h);
                l = new CKFinder();
                for (var n in h) {
                    l[n] = h[n];
                    if (n == 'width') {
                        var o = l[n] || 800;
                        if (typeof o == 'string' && o.length > 1 && o.substr(o.length - 1, 1) == '%') o = parseInt(window.screen.width * parseInt(o, 10) / 100, 10);
                        g.config.filebrowserWindowWidth = o;
                    } else if (n == 'height') {
                        var p = l[n] || 600;
                        if (typeof p == 'string' && p.length > 1 && p.substr(p.length - 1, 1) == '%') p = parseInt(window.screen.height * parseInt(p, 10) / 100, 10);
                        g.config.filebrowserWindowHeight = p;
                    }
                }
            } else {
                l = new CKFinder();
                l.basePath = h;
            }
            var q = l.basePath;
            if (q.substr(0, 1) != '/' && q.indexOf('://') == -1) q = document.location.pathname.substring(0, document.location.pathname.lastIndexOf('/') + 1) + q;
            q = a.lj.call(l, q);
            var r = q.indexOf('?') !== -1 ? '&' : '?';
            if (m) {
                q += r + 'configId=' + m;
                r = '&';
            }
            g.config.filebrowserBrowseUrl = q;
            g.config.filebrowserImageBrowseUrl = q + r + 'type=' + (i || 'Images');
            g.config.filebrowserFlashBrowseUrl = q + r + 'type=' + (j || 'Flash');
            var s = q.substring(0, 1 + q.lastIndexOf('/'));
            g.config.filebrowserUploadUrl = s + 'core/connector/' + CKFinder.config.connectorLanguage + '/connector.' + CKFinder.config.connectorLanguage + '?command=QuickUpload&type=Files';
            g.config.filebrowserImageUploadUrl = s + 'core/connector/' + CKFinder.config.connectorLanguage + '/connector.' + CKFinder.config.connectorLanguage + '?command=QuickUpload&type=' + (i || 'Images');
            g.config.filebrowserFlashUploadUrl = s + 'core/connector/' + CKFinder.config.connectorLanguage + '/connector.' + CKFinder.config.connectorLanguage + '?command=QuickUpload&type=' + (j || 'Flash');
        };
    })();
    if (!a.event) {
        a.event = function() {};
        a.event.du = function(f, g) {
            var h = a.event.prototype;
            for (var i in h) {
                if (f[i] == undefined) f[i] = h[i];
            }
        };
        a.event.prototype = (function() {
            var f = function(h) {
                    var i = h.kk && h.kk() || h._ || (h._ = {});
                    return i.cC || (i.cC = {});
                },
                g = function(h) {
                    this.name = h;
                    this.dF = [];
                };
            g.prototype = {
                mi: function(h) {
                    for (var i = 0, j = this.dF; i < j.length; i++) {
                        if (j[i].fn == h) return i;
                    }
                    return -1;
                }
            };
            return {
                on: function(h, i, j, k, l) {
                    var m = f(this),
                        n = m[h] || (m[h] = new g(h));
                    if (n.mi(i) < 0) {
                        var o = n.dF;
                        if (!j) j = this;
                        if (isNaN(l)) l = 10;
                        var p = this,
                            q = function(s, t, u, v) {
                                var w = {
                                    name: h,
                                    jN: this,
                                    application: s,
                                    data: t,
                                    jO: k,
                                    stop: u,
                                    cancel: v,
                                    removeListener: function() {
                                        p.removeListener(h, i);
                                    }
                                };
                                i.call(j, w);
                                return w.data;
                            };
                        q.fn = i;
                        q.nT = l;
                        for (var r = o.length - 1; r >= 0; r--) {
                            if (o[r].nT <= l) {
                                o.splice(r + 1, 0, q);
                                return;
                            }
                        }
                        o.unshift(q);
                    }
                },
                oW: (function() {
                    var h = false,
                        i = function() {
                            h = true;
                        },
                        j = false,
                        k = function(l) {
                            j = l ? 2 : true;
                        };
                    return function w(l, m, n, o) {
                        if (typeof m == 'function') {
                            o = m;
                            m = null;
                        } else if (typeof n == 'function') {
                            o = n;
                            n = null;
                        }
                        if (l != 'mousemove') a.log('[EVENT] ' + l, m, o);
                        var p = f(this)[l],
                            q = h,
                            r = j;
                        h = j = false;
                        if (p) {
                            var s = p.dF;
                            if (s.length) {
                                s = s.slice(0);
                                for (var t = 0; t < s.length; t++) {
                                    var u = s[t].call(this, n, m, i, k);
                                    if (typeof u != 'undefined') m = u;
                                    if (h || j && j != 2) break;
                                }
                            }
                        }
                        var v = j || (typeof m == 'undefined' ? false : !m || typeof m.result == 'undefined' ? m : m.result);
                        if (typeof o === 'function' && j != 2) v = o.call(this, j, m) || v;
                        h = q;
                        j = r;
                        return v;
                    };
                })(),
                cr: function(h, i, j) {
                    var k = this.oW(h, i, j);
                    delete f(this)[h];
                    return k;
                },
                removeListener: function(h, i) {
                    var j = f(this)[h];
                    if (j) {
                        var k = j.mi(i);
                        if (k >= 0) j.dF.splice(k, 1);
                    }
                },
                mF: function() {
                    var h = f(this);
                    for (var i = 0; i < h.length; i++) h[i].dF = [];
                },
                rC: function(h) {
                    var i = f(this)[h];
                    return i && i.dF.length > 0;
                }
            };
        })();
    }
    if (!a.application) {
        a.kZ = 0;
        a.fc = 1;
        a.qE = 2;
        a.application = function(f, g, h, i) {
            var j = this;
            j._ = {
                instanceConfig: f,
                element: g
            };
            j.ff = h || a.kZ;
            a.event.call(j);
            j.iI(i);
        };
        a.application.replace = function(f, g, h) {
            var i = f;
            if (typeof i != 'object') {
                i = document.getElementById(f);
                if (!i) {
                    var j = 0,
                        k = document.getElementsByName(f);
                    while ((i = k[j++]) && i.tagName.toLowerCase() != 'textarea') {}
                }
                if (!i) throw '[CKFINDER.application.replace] The element with id or name "' + f + '" was not found.';
            }
            return new a.application(g, i, a.fc, h);
        };
        a.application.appendTo = function(f, g, h) {
            if (typeof f != 'object') {
                f = document.getElementById(f);
                if (!f) throw '[CKFINDER.application.appendTo] The element with id "' + f + '" was not found.';
            }
            return new a.application(g, f, a.qE, h);
        };
        a.application.prototype = {
            iI: function() {
                var f = a.application.eb || (a.application.eb = []);
                f.push(this);
            },
            oW: function(f, g, h) {
                return a.event.prototype.oW.call(this, f, g, this, h);
            },
            cr: function(f, g, h) {
                return a.event.prototype.cr.call(this, f, g, this, h);
            }
        };
        a.event.du(a.application.prototype, true);
    }
    if (!a.env) {
        a.env = (function() {
            var f = navigator.userAgent.toLowerCase(),
                g = window.opera,
                h = {
                    ie: /*@cc_on!@*/
                        false,
                    opera: !!g && g.version,
                    webkit: f.indexOf(' applewebkit/') > -1,
                    air: f.indexOf(' adobeair/') > -1,
                    mac: f.indexOf('macintosh') > -1,
                    quirks: document.compatMode == 'BackCompat',
                    isCustomDomain: function() {
                        return this.ie && document.domain != window.location.hostname;
                    }
                };
            h.gecko = navigator.product == 'Gecko' && !h.webkit && !h.opera;
            h.chrome = false;
            h.safari = false;
            if (h.webkit) if (f.indexOf(' chrome/') > -1) h.chrome = true;
            else h.safari = true;
            var i = 0;
            if (h.ie) {
                i = parseFloat(f.match(/msie (\d+)/)[1]);
                h.ie8 = !!document.documentMode;
                h.ie8Compat = document.documentMode == 8;
                h.ie7Compat = i == 7 && !document.documentMode || document.documentMode == 7;
                h.ie6Compat = false;
            }
            if (h.gecko) {
                var j = f.match(/rv:([\d\.]+)/);
                if (j) {
                    j = j[1].split('.');
                    i = j[0] * 10000 + (j[1] || 0) * 100 + +(j[2] || 0);
                }
                h.isMobile = f.indexOf('fennec') > -1;
            }
            if (h.opera) {
                i = parseFloat(g.version());
                h.isMobile = f.indexOf('opera mobi') > -1;
            }
            if (h.air) i = parseFloat(f.match(/ adobeair\/(\d+)/)[1]);
            if (h.webkit) {
                i = parseFloat(f.match(/ applewebkit\/(\d+)/)[1]);
                h.isMobile = f.indexOf('mobile') > -1;
            }
            h.version = i;
            h.isCompatible = h.ie && i >= 6 || h.gecko && i >= 10801 || h.opera && i >= 9.5 || h.air && i >= 1 || h.webkit && i >= 522 || false;
            h.cssClass = 'browser_' + (h.ie ? 'ie' : h.gecko ? 'gecko' : h.opera ? 'opera' : h.air ? 'air' : h.webkit ? 'webkit' : 'unknown');
            if (h.quirks) h.cssClass += ' browser_quirks';
            if (h.ie) {
                h.cssClass += ' browser_ie' + (h.version < 7 ? '6' : h.version >= 8 ? '8' : '7');
                if (h.quirks) h.cssClass += ' browser_iequirks';
                if (h.ie7Compat) h.cssClass += ' browser_ie7Compat';
            }
            if (h.gecko && i < 10900) h.cssClass += ' browser_gecko18';
            return h;
        })();
        CKFinder.env = a.env;
    }
    var f = a.env;
    var g = f.ie;
    if (a.status == 'unloaded')(function() {
        a.event.du(a);
        a.dO = function() {
            if (a.status != 'basic_ready') {
                a.dO.qr = true;
                return;
            }
            delete a.dO;
            var i = document.createElement('script');
            i.type = 'text/javascript';
            i.src = a.basePath + 'ckfinder.js';
            document.getElementsByTagName('head')[0].appendChild(i);
        };
        a.mS = 0;
        a.uQ = 'ckfinder';
        a.uM = true;
        var h = function(i, j, k, l) {
            if (f.isCompatible) {
                if (a.dO) a.dO();
                var m = k(i, j, l);
                a.add(m);
                return m;
            }
            return null;
        };
        a.replace = function(i, j, k) {
            return h(i, j, a.application.replace, k);
        };
        a.appendTo = function(i, j, k) {
            return h(i, j, a.application.appendTo, k);
        };
        a.add = function(i) {
            var j = this._.io || (this._.io = []);
            j.push(i);
        };
        a.uL = function() {
            var i = document.getElementsByTagName('textarea');
            for (var j = 0; j < i.length; j++) {
                var k = null,
                    l = i[j],
                    m = l.name;
                if (!l.name && !l.id) continue;
                if (typeof arguments[0] == 'string') {
                    var n = new RegExp('(?:^| )' + arguments[0] + '(?:$| )');
                    if (!n.test(l.className)) continue;
                } else if (typeof arguments[0] == 'function') {
                    k = {};
                    if (arguments[0](l, k) === false) continue;
                }
                this.replace(l, k);
            }
        };
        (function() {
            var i = function() {
                var j = a.dO,
                    k = a.mS;
                a.status = 'basic_ready';
                if (j && j.qr) j();
                else if (k) setTimeout(function() {
                    if (a.dO) a.dO();
                }, k * 1000);
            };
            if (window.addEventListener) window.addEventListener('load', i, false);
            else if (window.attachEvent) window.attachEvent('onload', i);
        })();
        a.status = 'basic_loaded';
    })();
    a.dom = {};
    CKFinder.dom = a.dom;
    var h = a.dom;
    a.ajax = (function() {
        var i = function() {
                if (!g || location.protocol != 'file:') try {
                    return new XMLHttpRequest();
                } catch (n) {}
                try {
                    return new ActiveXObject('Msxml2.XMLHTTP');
                } catch (o) {}
                try {
                    return new ActiveXObject('Microsoft.XMLHTTP');
                } catch (p) {}
                return null;
            },
            j = function(n) {
                return n.readyState == 4 && (n.status >= 200 && n.status < 300 || n.status == 304 || n.status === 0 || n.status == 1223);
            },
            k = function(n) {
                if (j(n)) return n.responseText;
                return null;
            },
            l = function(n) {
                if (j(n)) {
                    var o = n.responseXML,
                        p = new a.xml(o && o.firstChild && o.documentElement && o.documentElement.nodeName != 'parsererror' ? o : n.responseText.replace(/^[^<]+/, '').replace(/[^>]+$/, ''));
                    if (p && p.mq && p.mq.documentElement && p.mq.documentElement.nodeName != 'parsererror' && p.mq.documentElement.nodeName != 'html' && p.mq.documentElement.nodeName != 'br') return p;
                }
                var q = a.nG || a.jt,
                    r = n.responseText,
                    s = q.lang.ErrorMsg[!r ? 'XmlEmpty' : 'XmlError'] + '<br>';
                if (p && p.mq) if (p.mq.parseError && p.mq.parseError.reason) s += p.mq.parseError.reason;
                else if (p.mq.documentElement && p.mq.documentElement.nodeName == 'parsererror') s += p.mq.documentElement.textContent;
                if (!r) q.msgDialog(q.lang.SysErrorDlgTitle, s);
                else {
                    if (/text\/plain/.test(n.getResponseHeader('Content-Type')) || /<Connector\s*/.test(r)) {
                        r = a.tools.htmlEncode(r);
                        r = r.replace(/\n/g, '<br>');
                        r = '<div style="width:600px; overflow:scroll"><font>' + r + '</font></div>';
                    }
                    q.msgDialog(q.lang.SysErrorDlgTitle, s + '<br>' + q.lang.ErrorMsg.XmlRawResponse.replace('%s', '<br><br>' + r));
                }
                return {};
            },
            m = function(n, o, p, q) {
                var r = !!o;
                a.log('[AJAX] ' + (q ? 'POST' : 'GET') + ' ' + n);
                var s = i();
                if (!s) return null;
                if (!q) s.open('GET', n, r);
                else s.open('POST', n, r);
                if (r) s.onreadystatechange = function() {
                    if (s.readyState == 4) {
                        o(p(s));
                        s = null;
                    }
                };
                if (q) {
                    s.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
                    s.send(q);
                } else s.send(null);
                return r ? '' : p(s);
            };
        return {
            load: function(n, o, p) {
                return m(n, o, k, p);
            },
            loadXml: function(n, o, p) {
                return m(n, o, l, p);
            }
        };
    })();
    CKFinder.ajax = a.ajax;
    (function() {
        var i = [];
        a.tools = {
            arrayCompare: function(j, k) {
                if (!j && !k) return true;
                if (!j || !k || j.length != k.length) return false;
                for (var l = 0; l < j.length; l++) {
                    if (j[l] != k[l]) return false;
                }
                return true;
            },
            clone: function(j) {
                var k;
                if (j && j instanceof Array) {
                    k = [];
                    for (var l = 0; l < j.length; l++) k[l] = this.clone(j[l]);
                    return k;
                }
                if (j === null || typeof j != 'object' || j instanceof String || j instanceof Number || j instanceof Boolean || j instanceof Date) return j;
                k = new j.constructor();
                for (var m in j) {
                    var n = j[m];
                    k[m] = this.clone(n);
                }
                return k;
            },
            capitalize: function(j) {
                return j.charAt(0).toUpperCase() + j.substring(1).toLowerCase();
            },
            extend: function(j) {
                var k = arguments.length,
                    l, m;
                if (typeof(l = arguments[k - 1]) == 'boolean') k--;
                else if (typeof(l = arguments[k - 2]) == 'boolean') {
                    m = arguments[k - 1];
                    k -= 2;
                }
                for (var n = 1; n < k; n++) {
                    var o = arguments[n];
                    for (var p in o) {
                        if (l === true || j[p] == undefined) if (!m || p in m) j[p] = o[p];
                    }
                }
                return j;
            },
            prototypedCopy: function(j) {
                var k = function() {};
                k.prototype = j;
                return new k();
            },
            isArray: function(j) {
                return !!j && j instanceof Array;
            },
            cssStyleToDomStyle: (function() {
                var j = document.createElement('div').style,
                    k = typeof j.cssFloat != 'undefined' ? 'cssFloat' : typeof j.styleFloat != 'undefined' ? 'styleFloat' : 'float';
                return function(l) {
                    if (l == 'float') return k;
                    else return l.replace(/-./g, function(m) {
                        return m.substr(1).toUpperCase();
                    });
                };
            })(),
            htmlEncode: function(j) {
                var k = function(o) {
                        var p = new h.element('span');
                        p.setText(o);
                        return p.getHtml();
                    },
                    l = k('\n').toLowerCase() == '<br>' ?
                        function(o) {
                            return k(o).replace(/<br>/gi, '\n');
                        } : k, m = k('>') == '>' ?
                        function(o) {
                            return l(o).replace(/>/g, '&gt;');
                        } : l, n = k('  ') == '&nbsp; ' ?
                        function(o) {
                            return m(o).replace(/&nbsp;/g, ' ');
                        } : m;
                this.htmlEncode = n;
                return this.htmlEncode(j);
            },
            getNextNumber: (function() {
                var j = 0;
                return function() {
                    return ++j;
                };
            })(),
            override: function(j, k) {
                return k(j);
            },
            setTimeout: function(j, k, l, m, n) {
                if (!n) n = window;
                if (!l) l = n;
                return n.setTimeout(function() {
                    if (m) j.apply(l, [].concat(m));
                    else j.apply(l);
                }, k || 0);
            },
            trim: (function() {
                var j = /(?:^[ \t\n\r]+)|(?:[ \t\n\r]+$)/g;
                return function(k) {
                    return k ? k.replace(j, '') : null;
                };
            })(),
            ltrim: (function() {
                var j = /^[ \t\n\r]+/g;
                return function(k) {
                    return k ? k.replace(j, '') : null;
                };
            })(),
            rtrim: (function() {
                var j = /[ \t\n\r]+$/g;
                return function(k) {
                    return k ? k.replace(j, '') : null;
                };
            })(),
            indexOf: Array.prototype.indexOf ?
                function(j, k) {
                    return j.indexOf(k);
                } : function(j, k) {
                for (var l = 0, m = j.length; l < m; l++) {
                    if (j[l] === k) return l;
                }
                return -1;
            },
            bind: function(j, k) {
                return function() {
                    return j.apply(k, arguments);
                };
            },
            createClass: function(j) {
                var k = j.$,
                    l = j.base,
                    m = j.vd || j._,
                    n = j.ej,
                    o = j.statics;
                if (m) {
                    var p = k;
                    k = function() {
                        var t = this;
                        var q = t._ || (t._ = {});
                        for (var r in m) {
                            var s = m[r];
                            q[r] = typeof s == 'function' ? a.tools.bind(s, t) : s;
                        }
                        p.apply(t, arguments);
                    };
                }
                if (l) {
                    k.prototype = this.prototypedCopy(l.prototype);
                    k.prototype['constructor'] = k;
                    k.prototype.base = function() {
                        this.base = l.prototype.base;
                        l.apply(this, arguments);
                        this.base = arguments.callee;
                    };
                }
                if (n) this.extend(k.prototype, n, true);
                if (o) this.extend(k, o, true);
                return k;
            },
            addFunction: function(j, k) {
                return i.push(function() {
                    j.apply(k || this, arguments);
                }) - 1;
            },
            removeFunction: function(j) {
                i[j] = null;
            },
            callFunction: function(j) {
                var k = i[j];
                return k.apply(window, Array.prototype.slice.call(arguments, 1));
            },
            cssLength: (function() {
                var j = /^\d+(?:\.\d+)?$/;
                return function(k) {
                    return k + (j.test(k) ? 'px' : '');
                };
            })(),
            repeat: function(j, k) {
                return new Array(k + 1).join(j);
            },
            deepCopy: function(j) {
                var k = {};
                if (typeof j == 'object') {
                    if (typeof j.length != 'undefined') k = [];
                    for (var l in j) {
                        if (j[l] === null) k[l] = null;
                        else if (typeof j[l] == 'object') k[l] = a.tools.deepCopy(j[l]);
                        else k[l] = j[l];
                    }
                }
                return k;
            },
            getUrlParam: function(j, k) {
                var l = new RegExp('(?:[?&]|&amp;)' + j + '=([^&]+)', 'i'),
                    m = (k || window).location.search.match(l);
                return m && m.length > 1 ? m[1] : null;
            },
            htmlEncode: function(j) {
                if (!j) return '';
                j = typeof j != 'string' ? j.toString() : j;
                j = j.replace(/&/g, '&amp;');
                j = j.replace(/</g, '&lt;');
                j = j.replace(/>/g, '&gt;');
                return j;
            },
            setCookie: function(j, k, l) {
                document.cookie = j + '=' + k + (!l ? '; expires=Thu, 6 Oct 2016 01:00:00 UTC; path=/' : '');
            },
            getCookie: function(j) {
                var k = document.cookie.match(new RegExp('(^|\\s|;)' + j + '=([^;]*)'));
                return k && k.length > 0 ? k[2] : '';
            },
            mH: function(j) {
                if (g) {
                    j.$.onfocusin = function() {
                        j.addClass('focus_inside');
                    };
                    j.$.onfocusout = function() {
                        j.removeClass('focus_inside');
                    };
                } else {
                    j.$.addEventListener('focus', function() {
                        j.addClass('focus_inside');
                    }, true);
                    j.$.addEventListener('blur', function() {
                        j.removeClass('focus_inside');
                    }, true);
                }
            },
            formatSize: function(j, k, l) {
                if (j == 0) return '0';
                if (j < 1) return k.Kb.replace('%1', 1);
                if (j < 1024) {
                    if (!l) j = j.toFixed(2);
                    return k.Kb.replace('%1', j);
                }
                if (j < 1048576) return k.Mb.replace('%1', (j / 1024).toFixed(2));
                return k.Gb.replace('%1', (j / 1048576).toFixed(2));
            },
            formatSpeed: function(j, k) {
                return k.SizePerSecond.replace('%1', this.formatSize(j, k));
            }
        };
        CKFinder._.callFunction = a.tools.callFunction;
        CKFinder.tools = a.tools;
    })();
    var i = a.tools;
    h.event = function(j) {
        this.$ = j;
    };
    h.event.prototype = {
        oV: function() {
            return this.$.keyCode || this.$.which || 0;
        },
        db: function() {
            var k = this;
            var j = k.oV();
            if (k.$.ctrlKey || k.$.metaKey) j += a.bP;
            if (k.$.shiftKey) j += a.dy;
            if (k.$.altKey) j += a.eJ;
            return j;
        },
        preventDefault: function(j) {
            var k = this.$;
            if (k.preventDefault) k.preventDefault();
            else k.returnValue = false;
            if (j) this.stopPropagation();
        },
        stopPropagation: function() {
            var j = this.$;
            if (j.stopPropagation) j.stopPropagation();
            else j.cancelBubble = true;
        },
        bK: function() {
            var j = this.$.target || this.$.srcElement;
            return j ? new h.bi(j) : null;
        },
        getButton: function() {
            if (this.$.which) return this.$.which;
            switch (this.$.button) {
                case 1:
                    return 1;
                case 4:
                    return 2;
                case 2:
                    return 3;
            }
        },
        ov: function() {
            return 1 == this.getButton();
        }
    };
    a.bP = 1000;
    a.dy = 2000;
    a.eJ = 4000;
    h.dE = function(j) {
        if (j) this.$ = j;
    };
    h.dE.prototype = (function() {
        var j = function(k, l) {
            return function(m) {
                if (typeof a != 'undefined') k.oW(l, new h.event(m));
            };
        };
        return {
            kk: function() {
                var k;
                if (!(k = this.dw('_'))) this.fL('_', k = {});
                return k;
            },
            on: function(k) {
                var n = this;
                var l = n.dw('_cke_nativeListeners');
                if (!l) {
                    l = {};
                    n.fL('_cke_nativeListeners', l);
                }
                if (!l[k]) {
                    var m = l[k] = j(n, k);
                    if (n.$.addEventListener) n.$.addEventListener(k, m, !!a.event.jP);
                    else if (n.$.attachEvent) n.$.attachEvent('on' + k, m);
                }
                return a.event.prototype.on.apply(n, arguments);
            },
            removeListener: function(k) {
                var n = this;
                a.event.prototype.removeListener.apply(n, arguments);
                if (!n.rC(k)) {
                    var l = n.dw('_cke_nativeListeners'),
                        m = l && l[k];
                    if (m) {
                        if (n.$.removeEventListener) n.$.removeEventListener(k, m, false);
                        else if (n.$.detachEvent) n.$.detachEvent('on' + k, m);
                        delete l[k];
                    }
                }
            }
        };
    })();
    (function(j) {
        var k = {};
        j.equals = function(l) {
            return l && l.$ === this.$;
        };
        j.fL = function(l, m) {
            var n = this.iY(),
                o = k[n] || (k[n] = {});
            o[l] = m;
            return this;
        };
        j.dw = function(l) {
            var m = this.$._ckf_expando,
                n = m && k[m];
            return n && n[l];
        };
        j.jF = function(l) {
            var m = this.$._ckf_expando,
                n = m && k[m],
                o = n && n[l];
            if (typeof o != 'undefined') delete n[l];
            return o || null;
        };
        j.iY = function() {
            return this.$._ckf_expando || (this.$._ckf_expando = i.getNextNumber());
        };
        a.event.du(j);
    })(h.dE.prototype);
    h.window = function(j) {
        h.dE.call(this, j);
    };
    h.window.prototype = new h.dE();
    i.extend(h.window.prototype, {
        focus: function() {
            if (f.webkit && this.$.parent) this.$.parent.focus();
            this.$.focus();
        },
        eR: function() {
            var j = this.$.document,
                k = j.compatMode == 'CSS1Compat';
            return {
                width: (k ? j.documentElement.clientWidth : j.body.clientWidth) || 0,
                height: (k ? j.documentElement.clientHeight : j.body.clientHeight) || 0
            };
        },
        hV: function() {
            var j = this.$;
            if ('pageXOffset' in j) return {
                x: j.pageXOffset || 0,
                y: j.pageYOffset || 0
            };
            else {
                var k = j.document;
                return {
                    x: k.documentElement.scrollLeft || k.body.scrollLeft || 0,
                    y: k.documentElement.scrollTop || k.body.scrollTop || 0
                };
            }
        }
    });
    h.document = function(j) {
        h.dE.call(this, j);
    };
    var j = h.document;
    j.prototype = new h.dE();
    i.extend(j.prototype, {
        appendStyleSheet: function(k) {
            if (this.$.createStyleSheet) this.$.createStyleSheet(k);
            else {
                var l = new h.element('link');
                l.setAttributes({
                    rel: 'stylesheet',
                    type: 'text/css',
                    href: k
                });
                this.getHead().append(l);
            }
        },
        createElement: function(k, l) {
            var m = new h.element(k, this);
            if (l) {
                if (l.attributes) m.setAttributes(l.attributes);
                if (l.gS) m.setStyles(l.gS);
            }
            return m;
        },
        jT: function(k) {
            return new h.text(k, this);
        },
        focus: function() {
            this.getWindow().focus();
        },
        getById: function(k) {
            var l = this.$.getElementById(k);
            return l ? new h.element(l) : null;
        },
        vu: function(k, l) {
            var m = this.$.documentElement;
            for (var n = 0; m && n < k.length; n++) {
                var o = k[n];
                if (!l) {
                    m = m.childNodes[o];
                    continue;
                }
                var p = -1;
                for (var q = 0; q < m.childNodes.length; q++) {
                    var r = m.childNodes[q];
                    if (l === true && r.nodeType == 3 && r.previousSibling && r.previousSibling.nodeType == 3) continue;
                    p++;
                    if (p == o) {
                        m = r;
                        break;
                    }
                }
            }
            return m ? new h.bi(m) : null;
        },
        eG: function(k, l) {
            if (!g && l) k = l + ':' + k;
            return new h.iT(this.$.getElementsByTagName(k));
        },
        getHead: function() {
            var k = this.$.getElementsByTagName('head')[0];
            k = new h.element(k);
            return (this.getHead = function() {
                return k;
            })();
        },
        bH: function() {
            var k = new h.element(this.$.body);
            return (this.bH = function() {
                return k;
            })();
        },
        gT: function() {
            var k = new h.element(this.$.documentElement);
            return (this.gT = function() {
                return k;
            })();
        },
        getWindow: function() {
            var k = new h.window(this.$.parentWindow || this.$.defaultView);
            return (this.getWindow = function() {
                return k;
            })();
        }
    });
    h.bi = function(k) {
        if (k) {
            switch (k.nodeType) {
                case a.cv:
                    return new h.element(k);
                case a.fl:
                    return new h.text(k);
            }
            h.dE.call(this, k);
        }
        return this;
    };
    h.bi.prototype = new h.dE();
    a.cv = 1;
    a.fl = 3;
    a.va = 8;
    a.om = 11;
    a.oh = 0;
    a.op = 1;
    a.gW = 2;
    a.gX = 4;
    a.mo = 8;
    a.lF = 16;
    i.extend(h.bi.prototype, {
        appendTo: function(k, l) {
            k.append(this, l);
            return k;
        },
        clone: function(k, l) {
            var m = this.$.cloneNode(k);
            if (!l) {
                var n = function(o) {
                    if (o.nodeType != a.cv) return;
                    o.removeAttribute('id', false);
                    o.removeAttribute('_ckf_expando', false);
                    var p = o.childNodes;
                    for (var q = 0; q < p.length; q++) n(p[q]);
                };
                n(m);
            }
            return new h.bi(m);
        },
        gE: function() {
            return !!this.$.previousSibling;
        },
        ge: function() {
            return !!this.$.nextSibling;
        },
        kB: function(k) {
            k.$.parentNode.insertBefore(this.$, k.$.nextSibling);
            return k;
        },
        insertBefore: function(k) {
            k.$.parentNode.insertBefore(this.$, k.$);
            return k;
        },
        vP: function(k) {
            this.$.parentNode.insertBefore(k.$, this.$);
            return k;
        },
        lU: function(k) {
            var l = [],
                m = this.getDocument().$.documentElement,
                n = this.$;
            while (n && n != m) {
                var o = n.parentNode,
                    p = -1;
                for (var q = 0; q < o.childNodes.length; q++) {
                    var r = o.childNodes[q];
                    if (k && r.nodeType == 3 && r.previousSibling && r.previousSibling.nodeType == 3) continue;
                    p++;
                    if (r == n) break;
                }
                l.unshift(p);
                n = n.parentNode;
            }
            return l;
        },
        getDocument: function() {
            var k = new j(this.$.ownerDocument || this.$.parentNode.ownerDocument);
            return (this.getDocument = function() {
                return k;
            })();
        },
        vA: function() {
            var k = this.$,
                l = k.parentNode && k.parentNode.firstChild,
                m = -1;
            while (l) {
                m++;
                if (l == k) return m;
                l = l.nextSibling;
            }
            return -1;
        },
        hL: function(k, l, m) {
            if (m && !m.call) {
                var n = m;
                m = function(q) {
                    return !q.equals(n);
                };
            }
            var o = !k && this.getFirst && this.getFirst(),
                p;
            if (!o) {
                if (this.type == a.cv && m && m(this, true) === false) return null;
                o = this.dG();
            }
            while (!o && (p = (p || this).getParent())) {
                if (m && m(p, true) === false) return null;
                o = p.dG();
            }
            if (!o) return null;
            if (m && m(o) === false) return null;
            if (l && l != o.type) return o.hL(false, l, m);
            return o;
        },
        hZ: function(k, l, m) {
            if (m && !m.call) {
                var n = m;
                m = function(q) {
                    return !q.equals(n);
                };
            }
            var o = !k && this.dB && this.dB(),
                p;
            if (!o) {
                if (this.type == a.cv && m && m(this, true) === false) return null;
                o = this.cf();
            }
            while (!o && (p = (p || this).getParent())) {
                if (m && m(p, true) === false) return null;
                o = p.cf();
            }
            if (!o) return null;
            if (m && m(o) === false) return null;
            if (l && o.type != l) return o.hZ(false, l, m);
            return o;
        },
        cf: function(k) {
            var l = this.$,
                m;
            do {
                l = l.previousSibling;
                m = l && new h.bi(l);
            } while (m && k && !k(m));
            return m;
        },
        vs: function() {
            return this.cf(function(k) {
                return k.$.nodeType == 1;
            });
        },
        dG: function(k) {
            var l = this.$,
                m;
            do {
                l = l.nextSibling;
                m = l && new h.bi(l);
            } while (m && k && !k(m));
            return m;
        },
        vk: function() {
            return this.dG(function(k) {
                return k.$.nodeType == 1;
            });
        },
        getParent: function() {
            var k = this.$.parentNode;
            return k && k.nodeType == 1 ? new h.bi(k) : null;
        },
        vn: function(k) {
            var l = this,
                m = [];
            do m[k ? 'push' : 'unshift'](l);
            while (l = l.getParent());
            return m;
        },
        vv: function(k) {
            var m = this;
            if (k.equals(m)) return m;
            if (k.contains && k.contains(m)) return k;
            var l = m.contains ? m : m.getParent();
            do {
                if (l.contains(k)) return l;
            } while (l = l.getParent());
            return null;
        },
        gz: function(k) {
            var l = this.$,
                m = k.$;
            if (l.compareDocumentPosition) return l.compareDocumentPosition(m);
            if (l == m) return a.oh;
            if (this.type == a.cv && k.type == a.cv) {
                if (l.contains) {
                    if (l.contains(m)) return a.lF + a.gX;
                    if (m.contains(l)) return a.mo + a.gW;
                }
                if ('sourceIndex' in l) return l.sourceIndex < 0 || m.sourceIndex < 0 ? a.op : l.sourceIndex < m.sourceIndex ? a.gX : a.gW;
            }
            var n = this.lU(),
                o = k.lU(),
                p = Math.min(n.length, o.length);
            for (var q = 0; q <= p - 1; q++) {
                if (n[q] != o[q]) {
                    if (q < p) return n[q] < o[q] ? a.gX : a.gW;
                    break;
                }
            }
            return n.length < o.length ? a.lF + a.gX : a.mo + a.gW;
        },
        vw: function(k, l) {
            var m = this.$;
            if (!l) m = m.parentNode;
            while (m) {
                if (m.nodeName && m.nodeName.toLowerCase() == k) return new h.bi(m);
                m = m.parentNode;
            }
            return null;
        },
        vX: function(k, l) {
            var m = this.$;
            if (!l) m = m.parentNode;
            while (m) {
                if (m.nodeName && m.nodeName.toLowerCase() == k) return true;
                m = m.parentNode;
            }
            return false;
        },
        move: function(k, l) {
            k.append(this.remove(), l);
        },
        remove: function(k) {
            var l = this.$,
                m = l.parentNode;
            if (m) {
                if (k) for (var n; n = l.firstChild;) m.insertBefore(l.removeChild(n), l);
                m.removeChild(l);
            }
            return this;
        },
        replace: function(k) {
            this.insertBefore(k);
            k.remove();
        },
        trim: function() {
            this.ltrim();
            this.rtrim();
        },
        ltrim: function() {
            var n = this;
            var k;
            while (n.getFirst && (k = n.getFirst())) {
                if (k.type == a.fl) {
                    var l = i.ltrim(k.getText()),
                        m = k.hJ();
                    if (!l) {
                        k.remove();
                        continue;
                    } else if (l.length < m) {
                        k.split(m - l.length);
                        n.$.removeChild(n.$.firstChild);
                    }
                }
                break;
            }
        },
        rtrim: function() {
            var n = this;
            var k;
            while (n.dB && (k = n.dB())) {
                if (k.type == a.fl) {
                    var l = i.rtrim(k.getText()),
                        m = k.hJ();
                    if (!l) {
                        k.remove();
                        continue;
                    } else if (l.length < m) {
                        k.split(l.length);
                        n.$.lastChild.parentNode.removeChild(n.$.lastChild);
                    }
                }
                break;
            }
            if (!g && !f.opera) {
                k = n.$.lastChild;
                if (k && k.type == 1 && k.nodeName.toLowerCase() == 'br') k.parentNode.removeChild(k);
            }
        }
    });
    h.iT = function(k) {
        this.$ = k;
    };
    h.iT.prototype = {
        count: function() {
            return this.$.length;
        },
        getItem: function(k) {
            var l = this.$[k];
            return l ? new h.bi(l) : null;
        }
    };
    h.element = function(k, l) {
        if (typeof k == 'string') k = (l ? l.$ : document).createElement(k);
        h.dE.call(this, k);
    };
    var k = h.element;
    k.eB = function(l) {
        return l && (l.$ ? l : new k(l));
    };
    k.prototype = new h.bi();
    k.kE = function(l, m) {
        var n = new k('div', m);
        n.setHtml(l);
        return n.getFirst().remove();
    };
    k.rS = function(l, m, n, o) {
        var p = m.dw('list_marker_id') || m.fL('list_marker_id', i.getNextNumber()).dw('list_marker_id'),
            q = m.dw('list_marker_names') || m.fL('list_marker_names', {}).dw('list_marker_names');
        l[p] = m;
        q[n] = 1;
        return m.fL(n, o);
    };
    k.sM = function(l) {
        for (var m in l) k.qZ(l, l[m], true);
    };
    k.qZ = function(l, m, n) {
        var o = m.dw('list_marker_names'),
            p = m.dw('list_marker_id');
        for (var q in o) m.jF(q);
        m.jF('list_marker_names');
        if (n) {
            m.jF('list_marker_id');
            delete l[p];
        }
    };
    i.extend(k.prototype, {
        type: a.cv,
        addClass: function(l) {
            var m = this.$.className;
            if (m) {
                var n = new RegExp('(?:^|\\s)' + l + '(?:\\s|$)', '');
                if (!n.test(m)) m += ' ' + l;
            }
            this.$.className = m || l;
        },
        removeClass: function(l) {
            var m = this.getAttribute('class');
            if (m) {
                var n = new RegExp('(?:^|\\s+)' + l + '(?=\\s|$)', 'i');
                if (n.test(m)) {
                    m = m.replace(n, '').replace(/^\s+/, '');
                    if (m) this.setAttribute('class', m);
                    else this.removeAttribute('class');
                }
            }
        },
        hasClass: function(l) {
            var m = new RegExp('(?:^|\\s+)' + l + '(?=\\s|$)', '');
            return m.test(this.getAttribute('class'));
        },
        append: function(l, m) {
            var n = this;
            if (typeof l == 'string') l = n.getDocument().createElement(l);
            if (m) n.$.insertBefore(l.$, n.$.firstChild);
            else n.$.appendChild(l.$);
            a.log('[DOM] DOM flush into ' + n.getName());
            return l;
        },
        appendHtml: function(l) {
            var n = this;
            if (!n.$.childNodes.length) n.setHtml(l);
            else {
                var m = new k('div', n.getDocument());
                m.setHtml(l);
                m.jg(n);
            }
        },
        appendText: function(l) {
            if (this.$.text != undefined) this.$.text += l;
            else this.append(new h.text(l));
        },
        pd: function() {
            var m = this;
            var l = m.dB();
            while (l && l.type == a.fl && !i.rtrim(l.getText())) l = l.cf();
            if (!l || !l.is || !l.is('br')) m.append(f.opera ? m.getDocument().jT('') : m.getDocument().createElement('br'));
        },
        tV: function(l) {
            var o = this;
            var m = new h.mk(o.getDocument());
            m.setStartAfter(o);
            m.setEndAfter(l);
            var n = m.extractContents();
            m.insertNode(o.remove());
            n.kA(o);
        },
        contains: g || f.webkit ?
            function(l) {
                var m = this.$;
                return l.type != a.cv ? m.contains(l.getParent().$) : m != l.$ && m.contains(l.$);
            } : function(l) {
            return !!(this.$.compareDocumentPosition(l.$) & 16);
        },
        focus: function() {
            try {
                this.$.focus();
            } catch (l) {}
        },
        getHtml: function() {
            return this.$.innerHTML;
        },
        fH: function() {
            var m = this;
            if (m.$.outerHTML) return m.$.outerHTML.replace(/<\?[^>]*>/, '');
            var l = m.$.ownerDocument.createElement('div');
            l.appendChild(m.$.cloneNode(true));
            return l.innerHTML;
        },
        setHtml: function(l) {
            a.log('[DOM] DOM flush into ' + this.getName());
            return this.$.innerHTML = l;
        },
        setText: function(l) {
            k.prototype.setText = this.$.innerText != undefined ?
                function(m) {
                    a.log('[DOM] Text flush');
                    return this.$.innerText = m;
                } : function(m) {
                a.log('[DOM] Text flush');
                return this.$.textContent = m;
            };
            return this.setText(l);
        },
        getAttribute: (function() {
            var l = function(m) {
                return this.$.getAttribute(m, 2);
            };
            if (g && (f.ie7Compat || f.ie6Compat)) return function(m) {
                var o = this;
                switch (m) {
                    case 'class':
                        m = 'className';
                        break;
                    case 'tabindex':
                        var n = l.call(o, m);
                        if (n !== 0 && o.$.tabIndex === 0) n = null;
                        return n;
                        break;
                    case 'checked':
                        return o.$.checked;
                        break;
                    case 'style':
                        return o.$.style.cssText;
                }
                return l.call(o, m);
            };
            else return l;
        })(),
        getChildren: function() {
            return new h.iT(this.$.childNodes);
        },
        getComputedStyle: g ?
            function(l) {
                return this.$.currentStyle[i.cssStyleToDomStyle(l)];
            } : function(l) {
            return this.getWindow().$.getComputedStyle(this.$, '').getPropertyValue(l);
        },
        pf: function() {
            var l = a.ga[this.getName()];
            this.pf = function() {
                return l;
            };
            return l;
        },
        eG: j.prototype.eG,
        vp: g ?
            function() {
                var l = this.$.tabIndex;
                if (l === 0 && !a.ga.ug[this.getName()] && parseInt(this.getAttribute('tabindex'), 10) !== 0) l = -1;
                return l;
            } : f.webkit ?
            function() {
                var l = this.$.tabIndex;
                if (l == undefined) {
                    l = parseInt(this.getAttribute('tabindex'), 10);
                    if (isNaN(l)) l = -1;
                }
                return l;
            } : function() {
            return this.$.tabIndex;
        },
        getText: function() {
            return this.$.textContent || this.$.innerText || '';
        },
        getWindow: function() {
            return this.getDocument().getWindow();
        },
        dS: function() {
            return this.$.id || null;
        },
        data: function(l, m) {
            l = 'data-' + l;
            if (m === undefined) return this.getAttribute(l);
            else if (m === false) this.removeAttribute(l);
            else this.setAttribute(l, m);
            return null;
        },
        vm: function() {
            return this.$.name || null;
        },
        getName: function() {
            var l = this.$.nodeName.toLowerCase();
            if (g && !(document.documentMode > 8)) {
                var m = this.$.scopeName;
                if (m != 'HTML') l = m.toLowerCase() + ':' + l;
            }
            return (this.getName = function() {
                return l;
            })();
        },
        getValue: function() {
            return this.$.value;
        },
        getFirst: function() {
            var l = this.$.firstChild;
            return l ? new h.bi(l) : null;
        },
        dB: function(l) {
            var m = this.$.lastChild,
                n = m && new h.bi(m);
            if (n && l && !l(n)) n = n.cf(l);
            return n;
        },
        rd: function(l) {
            return this.$.style[i.cssStyleToDomStyle(l)];
        },
        is: function() {
            var l = this.getName();
            for (var m = 0; m < arguments.length; m++) {
                if (arguments[m] == l) return true;
            }
            return false;
        },
        vL: function() {
            var l = this.getName(),
                m = !a.ga.uj[l] && (a.ga[l] || a.ga.span);
            return m && m['#'];
        },
        isIdentical: function(l) {
            if (this.getName() != l.getName()) return false;
            var m = this.$.attributes,
                n = l.$.attributes,
                o = m.length,
                p = n.length;
            if (!g && o != p) return false;
            for (var q = 0; q < o; q++) {
                var r = m[q];
                if ((!g || r.specified && r.nodeName != '_ckf_expando') && r.nodeValue != l.getAttribute(r.nodeName)) return false;
            }
            if (g) for (q = 0; q < p; q++) {
                r = n[q];
                if ((!g || r.specified && r.nodeName != '_ckf_expando') && r.nodeValue != m.getAttribute(r.nodeName)) return false;
            }
            return true;
        },
        isVisible: function() {
            return this.$.offsetWidth && this.$.style.visibility != 'hidden';
        },
        hasAttributes: g && (f.ie7Compat || f.ie6Compat) ?
            function() {
                var l = this.$.attributes;
                for (var m = 0; m < l.length; m++) {
                    var n = l[m];
                    switch (n.nodeName) {
                        case 'class':
                            if (this.getAttribute('class')) return true;
                        case '_ckf_expando':
                            continue;
                        default:
                            if (n.specified) return true;
                    }
                }
                return false;
            } : function() {
            var l = this.$.attributes;
            return l.length > 1 || l.length == 1 && l[0].nodeName != '_ckf_expando';
        },
        hasAttribute: function(l) {
            var m = this.$.attributes.getNamedItem(l);
            return !!(m && m.specified);
        },
        hide: function() {
            this.setStyle('display', 'none');
        },
        jg: function(l, m) {
            var n = this.$;
            l = l.$;
            if (n == l) return;
            var o;
            if (m) while (o = n.lastChild) l.insertBefore(n.removeChild(o), l.firstChild);
            else while (o = n.firstChild) l.appendChild(n.removeChild(o));
        },
        show: function() {
            this.setStyles({
                display: '',
                visibility: ''
            });
        },
        setAttribute: (function() {
            var l = function(m, n) {
                this.$.setAttribute(m, n);
                return this;
            };
            if (g && (f.ie7Compat || f.ie6Compat)) return function(m, n) {
                var o = this;
                if (m == 'class') o.$.className = n;
                else if (m == 'style') o.$.style.cssText = n;
                else if (m == 'tabindex') o.$.tabIndex = n;
                else if (m == 'checked') o.$.checked = n;
                else l.apply(o, arguments);
                return o;
            };
            else return l;
        })(),
        setAttributes: function(l) {
            for (var m in l) this.setAttribute(m, l[m]);
            return this;
        },
        setValue: function(l) {
            this.$.value = l;
            return this;
        },
        removeAttribute: (function() {
            var l = function(m) {
                this.$.removeAttribute(m);
            };
            if (g && (f.ie7Compat || f.ie6Compat)) return function(m) {
                if (m == 'class') m = 'className';
                else if (m == 'tabindex') m = 'tabIndex';
                l.call(this, m);
            };
            else return l;
        })(),
        uW: function(l) {
            for (var m = 0; m < l.length; m++) this.removeAttribute(l[m]);
        },
        removeStyle: function(l) {
            var m = this;
            if (m.$.style.removeAttribute) m.$.style.removeAttribute(i.cssStyleToDomStyle(l));
            else m.setStyle(l, '');
            if (!m.$.style.cssText) m.removeAttribute('style');
        },
        setStyle: function(l, m) {
            this.$.style[i.cssStyleToDomStyle(l)] = m;
            return this;
        },
        setStyles: function(l) {
            for (var m in l) this.setStyle(m, l[m]);
            return this;
        },
        setOpacity: function(l) {
            if (g && f.version < 9) {
                l = Math.round(l * 100);
                this.setStyle('filter', l >= 100 ? '' : 'progid:DXImageTransform.Microsoft.Alpha(opacity=' + l + ')');
            } else this.setStyle('opacity', l);
        },
        unselectable: f.gecko ?
            function() {
                this.$.style.MozUserSelect = 'none';
            } : f.webkit ?
            function() {
                this.$.style.uE = 'none';
            } : function() {
            if (g || f.opera) {
                var l = this.$,
                    m, n = 0;
                l.unselectable = 'on';
                while (m = l.all[n++]) switch (m.tagName.toLowerCase()) {
                    case 'iframe':
                    case 'textarea':
                    case 'input':
                    case 'select':
                        break;
                    default:
                        m.unselectable = 'on';
                }
            }
        },
        vr: function() {
            var l = this;
            while (l.getName() != 'html') {
                if (l.getComputedStyle('position') != 'static') return l;
                l = l.getParent();
            }
            return null;
        },
        ir: function(l) {
            var G = this;
            var m = 0,
                n = 0,
                o = G.getDocument().bH(),
                p = G.getDocument().$.compatMode == 'BackCompat',
                q = G.getDocument();
            if (document.documentElement.getBoundingClientRect) {
                var r = G.$.getBoundingClientRect(),
                    s = q.$,
                    t = s.documentElement,
                    u = t.clientTop || o.$.clientTop || 0,
                    v = t.clientLeft || o.$.clientLeft || 0,
                    w = true;
                if (g) {
                    var x = q.gT().contains(G),
                        y = q.bH().contains(G);
                    w = p && y || !p && x;
                }
                if (w) {
                    m = r.left + (!p && t.scrollLeft || o.$.scrollLeft);
                    m -= v;
                    n = r.top + (!p && t.scrollTop || o.$.scrollTop);
                    n -= u;
                }
            } else {
                var z = G,
                    A = null,
                    B;
                while (z && !(z.getName() == 'body' || z.getName() == 'html')) {
                    m += z.$.offsetLeft - z.$.scrollLeft;
                    n += z.$.offsetTop - z.$.scrollTop;
                    if (!z.equals(G)) {
                        m += z.$.clientLeft || 0;
                        n += z.$.clientTop || 0;
                    }
                    var C = A;
                    while (C && !C.equals(z)) {
                        m -= C.$.scrollLeft;
                        n -= C.$.scrollTop;
                        C = C.getParent();
                    }
                    A = z;
                    z = (B = z.$.offsetParent) ? new k(B) : null;
                }
            }
            if (l) {
                var D = G.getWindow(),
                    E = l.getWindow();
                if (!D.equals(E) && D.$.frameElement) {
                    var F = new k(D.$.frameElement).ir(l);
                    m += F.x;
                    n += F.y;
                }
            }
            if (!document.documentElement.getBoundingClientRect) if (f.gecko && !p) {
                m += G.$.clientLeft ? 1 : 0;
                n += G.$.clientTop ? 1 : 0;
            }
            return {
                x: m,
                y: n
            };
        },
        scrollIntoView: function(l) {
            var r = this;
            var m = r.getWindow(),
                n = m.eR().height,
                o = n * -1;
            if (l) o += n;
            else {
                o += r.$.offsetHeight || 0;
                o += parseInt(r.getComputedStyle('marginBottom') || 0, 10) || 0;
            }
            var p = r.ir();
            o += p.y;
            o = o < 0 ? 0 : o;
            var q = m.hV().y;
            if (o > q || o < q - n) m.$.scrollTo(0, o);
        },
        bR: function(l) {
            var m = this;
            switch (l) {
                case a.eV:
                    m.addClass('cke_on');
                    m.removeClass('cke_off');
                    m.removeClass('cke_disabled');
                    break;
                case a.aY:
                    m.addClass('cke_disabled');
                    m.removeClass('cke_off');
                    m.removeClass('cke_on');
                    break;
                default:
                    m.addClass('cke_off');
                    m.removeClass('cke_on');
                    m.removeClass('cke_disabled');
                    break;
            }
        },
        getFrameDocument: function() {
            var l = this.$;
            try {
                l.contentWindow.document;
            } catch (m) {
                l.src = l.src;
                if (g && f.version < 7) window.showModalDialog('javascript:document.write("<script>window.setTimeout(function(){window.close();},50);</script>")');
            }
            return l && new j(l.contentWindow.document);
        },
        qw: function(l, m) {
            var s = this;
            var n = s.$.attributes;
            m = m || {};
            for (var o = 0; o < n.length; o++) {
                var p = n[o];
                if (p.specified || g && p.nodeValue && p.nodeName.toLowerCase() == 'value') {
                    var q = p.nodeName;
                    if (q in m) continue;
                    var r = s.getAttribute(q);
                    if (r === null) r = p.nodeValue;
                    l.setAttribute(q, r);
                }
            }
            if (s.$.style.cssText !== '') l.$.style.cssText = s.$.style.cssText;
        },
        renameNode: function(l) {
            var o = this;
            if (o.getName() == l) return;
            var m = o.getDocument(),
                n = new k(l, m);
            o.qw(n);
            o.jg(n);
            o.$.parentNode.replaceChild(n.$, o.$);
            n.$._ckf_expando = o.$._ckf_expando;
            o.$ = n.$;
        },
        getChild: function(l) {
            var m = this.$;
            if (!l.slice) m = m.childNodes[l];
            else while (l.length > 0 && m) m = m.childNodes[l.shift()];
            return m ? new h.bi(m) : null;
        },
        iu: function() {
            return this.$.childNodes.length;
        },
        hX: function() {
            this.on('contextmenu', function(l) {
                if (!l.data.bK().hasClass('cke_enable_context_menu')) l.data.preventDefault();
            });
        },
        'toString': function() {
            return this.getName() + '#' + this.dS() + '.' + this.getAttribute('class');
        }
    });
    (function() {
        var l = {
            width: ['border-left-width', 'border-right-width', 'padding-left', 'padding-right'],
            height: ['border-top-width', 'border-bottom-width', 'padding-top', 'padding-bottom']
        };

        function m(n) {
            var o = 0;
            for (var p = 0, q = l[n].length; p < q; p++) o += parseInt(this.getComputedStyle(l[n][p]) || 0, 10) || 0;
            return o;
        };
        k.prototype.setSize = function(n, o, p) {
            if (typeof o == 'number') {
                if (p && !(g && f.quirks)) o -= m.call(this, n);
                this.setStyle(n, o + 'px');
            }
        };
        k.prototype.hR = function(n, o) {
            var p = Math.max(this.$['offset' + i.capitalize(n)], this.$['client' + i.capitalize(n)]) || 0;
            if (o) p -= m.call(this, n);
            return p;
        };
    })();
    a.command = function(l, m) {
        this.pW = [];
        this.exec = function(n) {
            if (this.bu == a.aY || this.readOnly === false && l.config.readOnly) return false;
            if (m.oD) l.focus();
            return m.exec.call(this, l, n) !== false;
        };
        i.extend(this, m, {
            iH: {
                qt: 1
            },
            oD: true,
            bu: a.aS
        });
        a.event.call(this);
    };
    a.command.prototype = {
        enable: function() {
            var l = this;
            if (l.bu == a.aY) l.bR(!l.vf || typeof l.lJ == 'undefined' ? a.aS : l.lJ);
        },
        disable: function() {
            this.bR(a.aY);
        },
        bR: function(l) {
            var m = this;
            if (m.bu == l) return false;
            m.lJ = m.bu;
            m.bu = l;
            m.oW('bu');
            return true;
        },
        rJ: function() {
            var l = this;
            if (l.bu == a.aS) l.bR(a.eV);
            else if (l.bu == a.eV) l.bR(a.aS);
        }
    };
    a.event.du(a.command.prototype, true);
    a.config = {
        customConfig: a.getUrl('config.js'),
        connectorLanguage: 'php',
        language: '',
        defaultLanguage: 'en',
        defaultViewType: 'thumbnails',
        defaultSortBy: 'filename',
        defaultDisplayFilename: true,
        defaultDisplayDate: true,
        defaultDisplayFilesize: true,
        pO: '',
        height: 400,
        plugins: 'foldertree,folder,filebrowser,container,connector,resource,toolbar,formpanel,filesview,status,contextmenu,uploadform,keystrokes,dragdrop,basket,dialog,tools,resize,maximize,help,flashupload,mobile,html5upload,gallery',
        extraPlugins: '',
        fileIcons: 'ai|avi|bmp|cs|dll|doc|docx|exe|fla|gif|jpg|js|mdb|mp3|ogg|pdf|ppt|pptx|rdp|swf|swt|txt|vsd|xls|xlsx|xml|zip',
        removePlugins: '',
        tabIndex: 0,
        thumbnailDelay: 50,
        theme: 'default',
        skin: 'kama',
        width: '100%',
        baseFloatZIndex: 10000,
        directDownload: false,
        log: false,
        logStackTrace: false,
        rememberLastFolder: true,
        id: null,
        startupPath: '',
        startupFolderExpanded: true,
        selectActionFunction: null,
        selectActionData: null,
        selectThumbnailActionFunction: null,
        selectThumbnailActionData: null,
        disableThumbnailSelection: false,
        thumbsUrl: null,
        thumbsDirectAccess: false,
        imagesMaxWidth: 0,
        imagesMaxHeight: 0,
        selectActionType: 'js',
        resourceType: null,
        disableHelpButton: false,
        connectorPath: '',
        connectorInfo: '',
        uiColor: null,
        showContextMenuArrow: false,
        useNativeIcons: false,
        maxSimultaneousUploads: 1,
        readOnly: false,
        selectMultiple: true
    };
    CKFinder.config = a.config;
    var l = a.config;
    a.dU = function(m, n) {
        this.rG = m;
        this.message = n;
    };
    a.fs = function(m) {
        if (m.fs) return m.fs;
        this.hasFocus = false;
        this._ = {
            application: m
        };
        return this;
    };
    a.fs.prototype = {
        focus: function() {
            var n = this;
            if (n._.fW) clearTimeout(n._.fW);
            if (!n.hasFocus) {
                if (a.nG) a.nG.fs.ly();
                var m = n._.application;
                m.container.getFirst().addClass('cke_focus');
                n.hasFocus = true;
                m.oW('focus');
            }
        },
        blur: function() {
            var m = this;
            if (m._.fW) clearTimeout(m._.fW);
            m._.fW = setTimeout(function() {
                delete m._.fW;
                m.ly();
            }, 100);
        },
        ly: function() {
            if (this.hasFocus) {
                var m = this._.application;
                m.container.getFirst().removeClass('cke_focus');
                this.hasFocus = false;
                m.oW('blur');
            }
        }
    };
    (function() {
        var m = {};
        a.lang = {
            ko: {
                bg: 1,
                ca: 1,
                cs: 1,
                cy: 1,
                da: 1,
                de: 1,
                el: 1,
                en: 1,
                eo: 1,
                es: 1,
                'es-mx': 1,
                et: 1,
                fa: 1,
                fi: 1,
                fr: 1,
                gu: 1,
                he: 1,
                hi: 1,
                hr: 1,
                hu: 1,
                it: 1,
                ja: 1,
                lv: 1,
                lt: 1,
                nb: 1,
                nl: 1,
                no: 1,
                nn: 1,
                pl: 1,
                'pt-br': 1,
                ro: 1,
                ru: 1,
                sk: 1,
                sl: 1,
                rc: 1,
                sv: 1,
                tr: 1,
                vi: 1,
                'zh-cn': 1,
                'zh-tw': 1
            },
            load: function(n, o, p) {
                if (!n || !a.lang.ko[n]) n = this.jV(o, n);
                if (!this[n]) a.scriptLoader.load(a.getUrl('lang/' + n + '.js'), function() {
                    p(n, CKFinder.lang[n]);
                }, this);
                else p(n, this[n]);
            },
            jV: function(n, o) {
                var p = this.ko;
                o = o || navigator.userLanguage || navigator.language;
                var q = o.toLowerCase().match(/([a-z]+)(?:-([a-z]+))?/),
                    r = q[1],
                    s = q[2];
                if (p[r + '-' + s]) r = r + '-' + s;
                else if (!p[r]) r = null;
                a.lang.jV = r ?
                    function() {
                        return r;
                    } : function(t) {
                    return t;
                };
                return r || n;
            }
        };
    })();
    (function() {
        a.log = function() {
            if (!l.log && !window.CKFINDER_LOG) return;
            var m = '';
            for (var n = 0; n < arguments.length; n++) {
                var o = arguments[n];
                if (!o) continue;
                if (m) m += '; ';
                switch (typeof o) {
                    case 'function':
                        var p = /function (\w+?)\(/.exec(o.toString());
                        p = p ? p[1] : 'anonymous func';
                        m += p;
                        break;
                    default:
                        m += o ? o.toString() : '';
                }
            }
            a._.log.push(m);
            if (typeof window.console == 'object') if (!console.log.apply) console.log(m);
            else console.log.apply(console, arguments);
        };
        a.ba = function(m) {
            if (l.logStackTrace) a.log('[EXCEPTION] ' + m.toString());
            return m;
        };
        a.mZ = function(m) {
            var n = '';
            for (var o = 0; o < a._.log.length; o++) n += o + 1 + '. ' + a._.log[o] + '\n';
            return n;
        };
        a._.log = [];
    })();
    a.scriptLoader = (function() {
        var m = {},
            n = {};
        return {
            load: function(o, p, q, r, s) {
                var t = typeof o == 'string';
                if (t) o = [o];
                if (!q) q = a;
                var u = o.length,
                    v = [],
                    w = [],
                    x = function(D) {
                        if (p) if (t) p.call(q, D);
                        else p.call(q, v, w);
                    };
                if (u === 0) {
                    x(true);
                    return;
                }
                var y = function(D, E) {
                        (E ? v : w).push(D);
                        if (--u <= 0) x(E);
                    },
                    z = function(D, E) {
                        m[D] = 1;
                        var F = n[D];
                        delete n[D];
                        for (var G = 0; G < F.length; G++) F[G](D, E);
                    },
                    A = function(D) {
                        if (r !== true && m[D]) {
                            y(D, true);
                            return;
                        }
                        var E = n[D] || (n[D] = []);
                        E.push(y);
                        if (E.length > 1) return;
                        var F = new k('script');
                        F.setAttributes({
                            type: 'text/javascript',
                            src: D
                        });
                        if (p) if (g) F.$.onreadystatechange = function() {
                            if (F.$.readyState == 'loaded' || F.$.readyState == 'complete') {
                                F.$.onreadystatechange = null;
                                a.log('[LOADED] ' + D);
                                z(D, true);
                            }
                        };
                        else {
                            F.$.onload = function() {
                                setTimeout(function() {
                                    a.log('[LOADED] ' + D);
                                    z(D, true);
                                }, 0);
                            };
                            F.$.onerror = function() {
                                z(D, false);
                            };
                        }
                        F.appendTo(s ? s : a.document.getHead());
                    };
                for (var B = 0, C = u; B < C; B++) A(o[B]);
            },
            uq: function(o) {
                var p = new k('script');
                p.setAttribute('type', 'text/javascript');
                p.appendText(o);
                p.appendTo(a.document.getHead());
            }
        };
    })();
    CKFinder.scriptLoader = a.scriptLoader;
    a.fQ = function(m, n) {
        var o = this;
        o.basePath = m;
        o.fileName = n;
        o.bX = {};
        o.loaded = {};
        o.jn = {};
        o._ = {
            rZ: {}
        };
    };
    a.fQ.prototype = {
        add: function(m, n) {
            if (this.bX[m]) throw '[CKFINDER.fQ.add] The resource name "' + m + '" is already bX.';
            this.bX[m] = n || {};
        },
        eB: function(m) {
            return this.bX[m] || null;
        },
        getPath: function(m) {
            var n = this.jn[m];
            return a.getUrl(n && n.dir || this.basePath + m + '/');
        },
        pi: function(m) {
            var n = this.jn[m];
            return a.getUrl(this.getPath(m) + (n && n.file || this.fileName + '.js'));
        },
        tR: function(m, n, o) {
            m = m.split(',');
            for (var p = 0; p < m.length; p++) {
                var q = m[p];
                this.jn[q] = {
                    dir: n,
                    file: o
                };
            }
        },
        load: function(m, n, o) {
            if (!i.isArray(m)) m = m ? [m] : [];
            var p = this.loaded,
                q = this.bX,
                r = [],
                s = {},
                t = {};
            for (var u = 0; u < m.length; u++) {
                var v = m[u];
                if (!v) continue;
                if (!p[v] && !q[v]) {
                    var w = this.pi(v);
                    r.push(w);
                    if (!(w in s)) s[w] = [];
                    s[w].push(v);
                } else t[v] = this.eB(v);
            }
            a.scriptLoader.load(r, function(x, y) {
                if (y.length) throw '[CKFINDER.fQ.load] Resource name "' + s[y[0]].join(',') + '" was not found at "' + y[0] + '".';
                for (var z = 0; z < x.length; z++) {
                    var A = s[x[z]];
                    for (var B = 0; B < A.length; B++) {
                        var C = A[B];
                        t[C] = this.eB(C);
                        p[C] = 1;
                    }
                }
                n.call(o, t);
            }, this);
        }
    };
    a.plugins = new a.fQ('plugins/', 'plugin');
    var m = a.plugins;
    m.load = i.override(m.load, function(n) {
        return function(o, p, q) {
            var r = {},
                s = function(t) {
                    n.call(this, t, function(u) {
                        i.extend(r, u);
                        var v = [];
                        for (var w in u) {
                            var x = u[w],
                                y = x && x.bM;
                            if (y) for (var z = 0; z < y.length; z++) {
                                if (!r[y[z]]) v.push(y[z]);
                            }
                        }
                        if (v.length) s.call(this, v);
                        else {
                            for (w in r) {
                                x = r[w];
                                if (x.onLoad && !x.onLoad.qK) {
                                    x.onLoad();
                                    x.onLoad.qK = 1;
                                }
                            }
                            if (p) p.call(q || window, r);
                        }
                    }, this);
                };
            s.call(this, o);
        };
    });
    m.rX = function(n, o, p) {
        var q = this.eB(n);
        q.lang[o] = p;
    };
    (function() {
        var n = {},
            o = function(p, q) {
                var r = function() {
                        n[p] = 1;
                        q();
                    },
                    s = new k('img');
                s.on('load', r);
                s.on('error', r);
                s.setAttribute('src', p);
            };
        a.rw = {
            load: function(p, q) {
                var r = p.length,
                    s = function() {
                        if (--r === 0) q();
                    };
                for (var t = 0; t < p.length; t++) {
                    var u = p[t];
                    if (n[u]) s();
                    else o(u, s);
                }
            }
        };
    })();
    a.skins = (function() {
        var n = {},
            o = {},
            p = {},
            q = function(r, s, t, u) {
                var v = n[s];
                if (!r.skin) {
                    r.skin = v;
                    if (v.bz) v.bz(r);
                }
                var w = function(E) {
                    for (var F = 0; F < E.length; F++) E[F] = a.getUrl(p[s] + E[F]);
                };
                if (!o[s]) {
                    var x = v.ls;
                    if (x && x.length > 0) {
                        w(x);
                        a.rw.load(x, function() {
                            o[s] = 1;
                            q(r, s, t, u);
                        });
                        return;
                    }
                    o[s] = 1;
                }
                t = v[t];
                var y = 0;
                if (t) {
                    if (!t.iB) t.iB = [];
                    else if (t.iB[r.name]) y = 1;
                } else y = 1;
                if (y) u && u();
                else {
                    if (t.eb === undefined) t.eb = [];
                    if (t.eb[r.name] === undefined) t.eb[r.name] = [];
                    var z = t.eb[r.name];
                    z.push(u);
                    if (z.length > 1) return;
                    var A = !t.css || !t.css.length,
                        B = !t.js || !t.js.length,
                        C = function() {
                            if (A && B) {
                                t.iB[r.name] = 1;
                                for (var E = 0; E < z.length; E++) {
                                    if (z[E]) z[E]();
                                }
                            }
                        };
                    if (!A) {
                        if (!t.rr) {
                            w(t.css);
                            t.rr = 1;
                        }
                        if (t.qx) for (var D = 0; D < t.css.length; D++) a.oC.appendStyleSheet(t.css[D]);
                        else r.on('themeSpace', function(E) {
                            if (E.data.space == 'head') for (var F = 0; F < t.css.length; F++) E.data.html += "<link rel='stylesheet' href='" + t.css[F] + "'>\n";
                            E.removeListener();
                        });
                        A = 1;
                    }
                    if (!B) {
                        w(t.js);
                        r.scriptLoader.load(t.js, function() {
                            B = 1;
                            C();
                        });
                    }
                    C();
                }
            };
        return {
            add: function(r, s) {
                n[r] = s;
                s.fh = p[r] || (p[r] = a.getUrl('skins/' + r + '/'));
            },
            loaded: n,
            load: function(r, s, t) {
                var u = r.gd,
                    v = r.fh;
                if (n[u]) {
                    q(r, u, s, t);
                    var w = n[u];
                } else {
                    p[u] = v;
                    a.scriptLoader.load(v + 'skin.js', function() {
                        q(r, u, s, t);
                    });
                }
            }
        };
    })();
    a.gc = new a.fQ('gc/', 'theme');
    a.bY = function(n) {
        if (n.bY) return n.bY;
        this._ = {
            jZ: {},
            items: {},
            application: n
        };
        return this;
    };
    var n = a.bY;
    n.prototype = {
        add: function(o, p, q) {
            this._.items[o] = {
                type: p,
                command: q.command || null,
                mp: Array.prototype.slice.call(arguments, 2)
            };
        },
        create: function(o) {
            var t = this;
            var p = t._.items[o],
                q = p && t._.jZ[p.type],
                r = p && p.command && t._.application.cS(p.command),
                s = q && q.create.apply(t, p.mp);
            if (r) r.pW.push(s);
            return s;
        },
        kd: function(o, p) {
            this._.jZ[o] = p;
        }
    };
    (function() {
        var o = 0,
            p = function() {
                var y = 'ckfinder' + ++o;
                return a.instances && a.instances[y] ? p() : y;
            },
            q = {},
            r = function(y) {
                var z = y.config.customConfig;
                if (!z) return false;
                var A = q[z] || (q[z] = {});
                if (A.fn) {
                    A.fn.call(y, y.config);
                    if (y.config.customConfig == z || !r(y)) y.cr('customConfigLoaded');
                } else a.scriptLoader.load(z, function() {
                    if (CKFinder.customConfig) A.fn = CKFinder.customConfig;
                    else A.fn = function() {};
                    r(y);
                });
                return true;
            },
            s = function(y, z) {
                y.on('customConfigLoaded', function() {
                    if (z) {
                        if (z.on) for (var A in z.on) y.on(A, z.on[A]);
                        i.extend(y.config, z, true);
                        delete y.config.on;
                    }
                    t(y);
                });
                if (z && z.id) y.config.id = z.id;
                if (z && z.customConfig != undefined) y.config.customConfig = z.customConfig;
                if (!r(y)) y.cr('customConfigLoaded');
            },
            t = function(y) {
                var z = y.config.skin.split(','),
                    A = z[0],
                    B = a.getUrl(z[1] || 'skins/' + A + '/');
                y.gd = A;
                y.fh = B;
                y.iy = 'cke_skin_' + A + ' skin_' + A;
                y.qn = y.ox();
                y.on('uiReady', function() {
                    y.document.getWindow().on('lW', function() {
                        i.setCookie('CKFinder_UTime', Math.round(new Date().getTime() / 1000), true);
                        i.setCookie('CKFinder_UId', encodeURIComponent(y.id ? y.id : location.href), true);
                    });
                });
                y.cr('configLoaded');
                u(y);
            },
            u = function(y) {
                a.lang.load(y.config.language, y.config.defaultLanguage, function(z, A) {
                    y.langCode = z;
                    y.lang = i.prototypedCopy(A);
                    y.lB = (function() {
                        var B = "['" + y.lang.DateAmPm.join("','") + "']",
                            C = y.lang.DateTime.replace(/dd|mm|yyyy|hh|HH|MM|aa|d|m|yy|h|H|M|a/g, function(D) {
                                var E;
                                switch (D) {
                                    case 'd':
                                        E = "day.replace(/^0/,'')";
                                        break;
                                    case 'dd':
                                        E = 'day';
                                        break;
                                    case 'm':
                                        E = "month.replace(/^0/,'')";
                                        break;
                                    case 'mm':
                                        E = 'month';
                                        break;
                                    case 'yy':
                                        E = 'year.substr(2)';
                                        break;
                                    case 'yyyy':
                                        E = 'year';
                                        break;
                                    case 'H':
                                        E = "hour.replace(/^0/,'')";
                                        break;
                                    case 'HH':
                                        E = 'hour';
                                        break;
                                    case 'h':
                                        E = "( hour < 12 ? hour : ( ( hour - 12 ) + 100 ).toString().substr( 1 ) ).replace(/^0/,'')";
                                        break;
                                    case 'hh':
                                        E = '( hour < 12 ? hour : ( ( hour - 12 ) + 100 ).toString().substr( 1 ) )';
                                        break;
                                    case 'M':
                                        E = "minute.replace(/^0/,'')";
                                        break;
                                    case 'MM':
                                        E = 'minute';
                                        break;
                                    case 'a':
                                        E = B + '[ hour < 12 ? 0 : 1 ].charAt(0)';
                                        break;
                                    case 'aa':
                                        E = B + '[ hour < 12 ? 0 : 1 ]';
                                        break;
                                    default:
                                        E = "'" + D + "'";
                                }
                                return "'," + E + ",'";
                            });
                        C = "'" + C + "'";
                        C = C.replace(/('',)|,''$/g, '');
                        return new Function('day', 'month', 'year', 'hour', 'minute', 'return [' + C + "].join('');");
                    })();
                    if (f.gecko && f.version < 10900 && y.lang.dir == 'rtl') y.lang.dir = 'ltr';
                    v(y);
                });
            },
            v = function(y) {
                var z = y.config,
                    A = z.plugins,
                    B = z.extraPlugins,
                    C = z.removePlugins;
                if (B) {
                    var D = new RegExp('(?:^|,)(?:' + B.replace(/\s*,\s*/g, '|') + ')(?=,|$)', 'g');
                    A = A.replace(D, '');
                    A += ',' + B;
                }
                if (C) {
                    D = new RegExp('(?:^|,)(?:' + C.replace(/\s*,\s*/g, '|') + ')(?=,|$)', 'g');
                    A = A.replace(D, '');
                }
                m.load(A.split(','), function(E) {
                    var F = [],
                        G = [],
                        H = [],
                        I;
                    if (y.config.readOnly) for (var I in E) {
                        if (E[I].readOnly === false) delete E[I];
                    }
                    y.plugins = E;
                    for (I in E) {
                        var J = E[I],
                            K = J.lang,
                            L = m.getPath(I),
                            M = null;
                        E[I].name = I;
                        J.pathName = L;
                        if (K) {
                            M = i.indexOf(K, y.langCode) >= 0 ? y.langCode : K[0];
                            if (!J.lang[M]) H.push(a.getUrl(L + 'lang/' + M + '.js'));
                            else {
                                i.extend(y.lang, J.lang[M]);
                                M = null;
                            }
                        }
                        G.push(M);
                        F.push(J);
                    }
                    a.scriptLoader.load(H, function() {
                        var N = ['eK', 'bz', 'gr'];
                        for (var O = 0; O < N.length; O++) for (var P = 0; P < F.length; P++) {
                            var Q = F[P];
                            if (O === 0 && G[P] && Q.lang) i.extend(y.lang, Q.lang[G[P]]);
                            if (Q[N[O]]) {
                                a.log('[PLUGIN] ' + Q.name + '.' + N[O]);
                                Q[N[O]](y);
                            }
                        }
                        y.oW('pluginsLoaded');
                        w(y);
                    });
                });
            },
            w = function(y) {
                a.skins.load(y, 'application', function() {
                    a.skins.load(y, 'host', function() {
                        x(y);
                    });
                });
            },
            x = function(y) {
                var z = y.config.theme;
                a.gc.load(z, function() {
                    var A = y.theme = a.gc.eB(z);
                    A.pathName = a.gc.getPath(z);
                    y.oW('themeAvailable');
                });
            };
        a.application.prototype.iI = function(y) {
            var z = k.eB(this._.element),
                A = this._.instanceConfig;
            delete this._.element;
            delete this._.instanceConfig;
            this._.ky = {};
            this._.gS = [];
            z.getDocument().getWindow().$.CKFinder = y;
            this.element = z;
            this.document = null;
            this.rQ = {};
            this.name = p();
            if (this.name in a.instances) throw '[CKFINDER.application] The instance "' + this.name + '" already exists.';
            this.config = i.prototypedCopy(l);
            this.bY = new n(this);
            this.fs = new a.fs(this);
            this.aL = {};
            this.aG = {};
            this.on('uiReady', function(B) {
                this.document.getWindow().on('lW', this.destroy, this);
                try {
                    var C = this.document.getWindow();
                    if (this.cg.inPopup && (!g && !f.opera || C.$.top.location.href.match(/ckfinder.html/) || C.$.top.name == 'CKFinderpopup')) {
                        var D = this,
                            E = [a.oC];
                        if (C.$.top.location.href.match(/ckfinder.html/) || C.$.top.name == 'CKFinderpopup') {
                            this.document.focus();
                            this.focus();
                        }
                        a.event.jP = true;
                        this.document.on('keydown', function(J) {
                            if (J.data.oV() == 116 || J.data.db() == a.bP + 82) {
                                D.execCommand('refresh');
                                C.$.event && C.$.event.keyCode && (C.$.event.keyCode = 5055);
                                try {
                                    J.data.preventDefault();
                                } catch (K) {}
                            }
                        });
                        a.event.jP = false;
                        if (D.cg.inUrlPopup) E.push(new j(a.oC.getWindow().$.opener.document));
                        var F = {},
                            G = function(J, K) {
                                F[K].push(J);
                                return function() {
                                    var L;
                                    if (J && (L = J.apply(this, arguments))) return L;
                                    D.element && D.element.getDocument().getWindow().$.close();
                                };
                            },
                            H = function() {
                                for (var J = 0; J < E.length; J++) {
                                    E[J].bH().$.onbeforeunload = F[J][0];
                                    E[J].getWindow().$.onunload = F[J][1];
                                    E[J].getWindow().$.onbeforeunload = F[J][2];
                                }
                            };
                        for (var I = 0; I < E.length; I++) {
                            F[I] = {};
                            E[I].bH().$.onbeforeunload = G(E[I].bH().$.onbeforeunload, I);
                            E[I].getWindow().$.onunload = G(E[I].getWindow().$.onunload, I);
                            E[I].getWindow().$.onbeforeunload = G(E[I].getWindow().$.onbeforeunload, I);
                        }
                        C.getDocument().bH().$.onbeforeunload = H;
                        C.$.onunload = H;
                        C.$.onbeforeunload = H;
                    }
                } catch (B) {}
            }, this);
            this.cg = new d(this);
            this.on('configLoaded', function(B) {
                var C = this;
                e(C.cg, C, C.config.callback);
                C.id = C.config.id;
            }, this);
            s(this, A);
            a.oW('instanceCreated', null, this);
        };
    })();
    i.extend(a.application.prototype, {
        bD: function(o, p) {
            return this._.ky[o] = new a.command(this, p);
        },
        destroy: function() {
            var o = this;
            o.theme.destroy(o);
            o.oW('destroy');
            a.remove(o);
        },
        execCommand: function(o, p) {
            a.log('[COMMAND] ' + o);
            var q = this.cS(o),
                r = {
                    name: o,
                    rm: p,
                    command: q
                };
            if (q && q.bu != a.aY) if (this.oW('beforeCommandExec', r) !== true) {
                r.returnValue = q.exec(r.rm);
                if (!q.async && this.oW('afterCommandExec', r) !== true) return r.returnValue;
            }
            return false;
        },
        cS: function(o) {
            return this._.ky[o];
        },
        ox: function() {
            var o = Math.round(new Date().getTime() / 1000),
                p = i.getCookie('CKFinder_UTime'),
                q = decodeURIComponent(i.getCookie('CKFinder_UId'));
            if (q && p && q == (this.id ? this.id : location.href) && Math.abs(o - p) < 5) return 1;
            return 0;
        },
        bs: ''
    });
    (function() {
        var o = '';
        for (var p = 49; p < 58; p++) o += String.fromCharCode(p);
        for (p = 65; p < 91; p++) {
            if (p == 73 || p == 79) continue;
            o += String.fromCharCode(p);
        }
        a.bs = o;
        a.nd = "\x6c\x6f";
        a.jG = "\x68\x6f";
        a.hf = new window["\122\145\147\x45\170\160"]("\x5e\x77\x77\167\x5c\x2e");
        a.hg = new window["\x52\145\147\105\170\160"]("\x3a\x5c\x64\053\044");
        a.lS = function(q) {
            return q.toLowerCase().replace(a.hf, '').replace(a.hg, '');
        };
    })();
    a.on('loaded', function() {
        var o = a.application.eb;
        if (o) {
            delete a.application.eb;
            for (var p = 0; p < o.length; p++) o[p].iI();
        }
    });
    delete a.dO;
    a.instances = {};
    a.document = new j(document);
    a.oC = a.document.getWindow().$ != a.document.getWindow().$.top ? new j(a.document.getWindow().$.top.document) : a.document;
    a.add = function(o) {
        a.instances[o.name] = o;
        a.jt = o;
        o.on('focus', function() {
            if (a.nG != o) {
                a.nG = o;
                a.oW('nG');
            }
        });
        o.on('blur', function() {
            if (a.nG == o) {
                a.nG = null;
                a.oW('nG');
            }
        });
    };
    a.remove = function(o) {
        delete a.instances[o.name];
    };
    a.aL = {};
    a.eV = 1;
    a.aS = 2;
    a.aY = 0;
    a.bF = '';
    (function() {
        function o(r, s) {
            return r + '.' + (s.name || s || r);
        };
        a.aG = {
            bX: {},
            hS: function(r, s, t) {
                var u = o(r, s);
                if (this.bX[u] !== undefined) throw '[CKFINDER] Widget ' + u + ' already bX!';
                a.log('[WIDGET] bX ' + u);
                this.bX[u] = new q(u, t);
                return this.bX[u];
            },
            bz: function(r, s, t, u, v) {
                var w = o(s, t),
                    x = this.bX[w],
                    y = i.deepCopy(x.hF),
                    z = function(C, D, E) {
                        this.app = C;
                        this.eh = D instanceof k ? D : new k(D);
                        this.hF = y ? i.extend(y, E) : E || {};
                        this._ = {};
                        var F = function(I) {
                            this.ib = I;
                        };
                        F.prototype = this.tools;
                        this.tools = new F(this);
                        var G = x.dT;
                        if (G.length) for (var H = 0; H < G.length; H++) G[H].call(this, C, this);
                    };
                z.prototype = x;
                var A = new z(r, u, v);
                for (var B in A.fw) {
                    if (A.fw[B].readOnly && r.config.readOnly) A.ke(B);
                    else A.gA(B);
                }
                if (r.aG[w]) throw '[CKFINDER Widget ' + w + ' already inited.';
                r.aG[w] = A;
                a.log('[WIDGET] instanced ' + w);
                return A;
            }
        };
        var p = {
                click: 1,
                mouseover: 1,
                mouseout: 1,
                focus: 1,
                blur: 1,
                submit: 1,
                dblclick: 1,
                mousedown: 1,
                mouseup: 1,
                mousemove: 1,
                keypress: 1,
                keydown: 1,
                keyup: 1,
                load: 1,
                lW: 1,
                abort: 1,
                error: 1,
                resize: 1,
                scroll: 1,
                select: 1,
                change: 1,
                reset: 1
            },
            q = function(r, s) {
                var t = this;
                t.id = r;
                t.readOnly = true;
                t.fw = {};
                t.hF = s || {};
                t.dT = [];
                t.tools = new t.tools(t);
            };
        q.prototype = {
            gA: function(r) {
                var w = this;
                a.log('[WIDGET] Enabling behavior ' + r);
                var s = w.fw[r];
                if (!s) return;
                var t = w;
                for (var u = 0; u < s.cC.length; u++) {
                    var v = s.cC[u];
                    if (p[v]) w.eh.on(v, s.fO, t);
                    else {
                        w.on(v, s.fO, t);
                        w.app.on(v, s.fO, t);
                    }
                }
            },
            ke: function(r) {
                a.log('[WIDGET] Disabling behavior ' + r);
                var s = this.fw[r];
                if (!s) return;
                for (var t = 0; t < s.cC.length; t++) {
                    var u = s.cC[t];
                    if (p[u]) this.eh.removeListener(u, s.fO);
                    else this.removeListener(u, s.fO);
                }
            },
            bh: function(r, s, t, u) {
                if (!i.isArray(s)) s = [s];
                this.fw[r] = {
                    cC: s,
                    fO: t,
                    readOnly: u === false
                };
                if (this.eh) this.gA(r);
            },
            removeBehavior: function(r) {
                delete this.fw[r];
            },
            ur: function() {
                return this.fw;
            },
            bn: function() {
                return this.eh;
            },
            oE: function() {
                return this.hF;
            },
            data: function() {
                return this.hF;
            },
            tools: function() {}
        };
        q.prototype.tools.prototype = {
            kg: function(r) {
                if (r.target == this.ib.eh) return 1;
            }
        };
        a.event.du(q.prototype);
    })();
    a.xml = function(o) {
        var p = null;
        if (typeof o == 'object') p = o;
        else {
            var q = (o || '').replace(/&nbsp;/g, '\xa0');
            if (window.DOMParser) p = new DOMParser().parseFromString(q, 'text/xml');
            else if (window.ActiveXObject) {
                try {
                    p = new ActiveXObject('MSXML2.DOMDocument');
                } catch (r) {
                    try {
                        p = new ActiveXObject('Microsoft.XmlDom');
                    } catch (r) {}
                }
                if (p) {
                    p.async = false;
                    p.resolveExternals = false;
                    p.validateOnParse = false;
                    p.loadXML(q);
                }
            }
        }
        this.mq = p;
    };
    a.xml.prototype = {
        selectSingleNode: function(o, p) {
            var q = this.mq;
            if (p || (p = q)) if ('selectSingleNode' in p) return p.selectSingleNode(o);
            else if (q.evaluate) {
                var r = q.evaluate(o, p, null, 9, null);
                return r && r.singleNodeValue || null;
            } else if (p.querySelectorAll) {
                var s = this.selectNodes(o, p);
                if (s.length == 1) {
                    var r = o.match(/\/@(.*$)/);
                    if (r) return s[0].getAttributeNode(r[1]);
                    else return s[0];
                }
            } else alert('XPath is not supported in your browser');
            return null;
        },
        selectNodes: function(o, p) {
            var q = this.mq,
                r = [];
            if (p || (p = q)) if ('selectNodes' in p) return p.selectNodes(o);
            else if (q.evaluate) {
                var s = q.evaluate(o, p, null, 5, null);
                if (s) {
                    var t;
                    while (t = s.iterateNext()) r.push(t);
                }
            } else if (p.querySelectorAll) {
                var u = o.replace(/\/@(.*$)/, '[$1]').replace(/\//gi, '>');
                return p.querySelectorAll(u);
            } else alert('XPath is not supported in your browser');
            return r;
        },
        vB: function(o, p) {
            var q = this.selectSingleNode(o, p),
                r = [];
            if (q) {
                q = q.firstChild;
                while (q) {
                    if (q.xml) r.push(q.xml);
                    else if (window.XMLSerializer) r.push(new XMLSerializer().serializeToString(q));
                    q = q.nextSibling;
                }
            }
            return r.length ? r.join('') : null;
        }
    };
    (function() {
        var o = {
                address: 1,
                tY: 1,
                dl: 1,
                h1: 1,
                h2: 1,
                h3: 1,
                h4: 1,
                h5: 1,
                h6: 1,
                p: 1,
                pre: 1,
                li: 1,
                dt: 1,
                de: 1
            },
            p = {
                body: 1,
                div: 1,
                table: 1,
                tbody: 1,
                tr: 1,
                td: 1,
                th: 1,
                caption: 1,
                form: 1
            },
            q = function(r) {
                var s = r.getChildren();
                for (var t = 0, u = s.count(); t < u; t++) {
                    var v = s.getItem(t);
                    if (v.type == a.cv && a.ga.um[v.getName()]) return true;
                }
                return false;
            };
        h.qS = function(r) {
            var x = this;
            var s = null,
                t = null,
                u = [],
                v = r;
            while (v) {
                if (v.type == a.cv) {
                    if (!x.qH) x.qH = v;
                    var w = v.getName();
                    if (g && v.$.scopeName != 'HTML') w = v.$.scopeName.toLowerCase() + ':' + w;
                    if (!t) {
                        if (!s && o[w]) s = v;
                        if (p[w]) if (!s && w == 'div' && !q(v)) s = v;
                        else t = v;
                    }
                    u.push(v);
                    if (w == 'body') break;
                }
                v = v.getParent();
            }
            x.block = s;
            x.tX = t;
            x.elements = u;
        };
    })();
    h.qS.prototype = {
        sJ: function(o) {
            var p = this.elements,
                q = o && o.elements;
            if (!q || p.length != q.length) return false;
            for (var r = 0; r < p.length; r++) {
                if (!p[r].equals(q[r])) return false;
            }
            return true;
        }
    };
    h.text = function(o, p) {
        if (typeof o == 'string') o = (p ? p.$ : document).createTextNode(o);
        this.$ = o;
    };
    h.text.prototype = new h.bi();
    i.extend(h.text.prototype, {
        type: a.fl,
        hJ: function() {
            return this.$.nodeValue.length;
        },
        getText: function() {
            return this.$.nodeValue;
        },
        split: function(o) {
            var t = this;
            if (g && o == t.hJ()) {
                var p = t.getDocument().jT('');
                p.kB(t);
                return p;
            }
            var q = t.getDocument(),
                r = new h.text(t.$.splitText(o), q);
            if (f.ie8) {
                var s = new h.text('', q);
                s.kB(r);
                s.remove();
            }
            return r;
        },
        substring: function(o, p) {
            if (typeof p != 'number') return this.$.nodeValue.substr(o);
            else return this.$.nodeValue.substring(o, p);
        }
    });
    h.pa = function(o) {
        o = o || a.document;
        this.$ = o.$.createDocumentFragment();
    };
    i.extend(h.pa.prototype, k.prototype, {
        type: a.om,
        kA: function(o) {
            o = o.$;
            o.parentNode.insertBefore(this.$, o.nextSibling);
        }
    }, true, {
        append: 1,
        pd: 1,
        getFirst: 1,
        dB: 1,
        appendTo: 1,
        jg: 1,
        insertBefore: 1,
        kA: 1,
        replace: 1,
        trim: 1,
        type: 1,
        ltrim: 1,
        rtrim: 1,
        getDocument: 1,
        iu: 1,
        getChild: 1,
        getChildren: 1
    });
    (function() {
        function o(s, t) {
            if (this._.end) return null;
            var u, v = this.mk,
                w, x = this.vR,
                y = this.type,
                z = s ? 'getPreviousSourceNode' : 'getNextSourceNode';
            if (!this._.start) {
                this._.start = 1;
                v.trim();
                if (v.collapsed) {
                    this.end();
                    return null;
                }
            }
            if (!s && !this._.kp) {
                var A = v.endContainer,
                    B = A.getChild(v.endOffset);
                this._.kp = function(F, G) {
                    return (!G || !A.equals(F)) && (!B || !F.equals(B)) && (F.type != a.cv || F.getName() != 'body');
                };
            }
            if (s && !this._.ka) {
                var C = v.startContainer,
                    D = v.startOffset > 0 && C.getChild(v.startOffset - 1);
                this._.ka = function(F, G) {
                    return (!G || !C.equals(F)) && (!D || !F.equals(D)) && (F.type != a.cv || F.getName() != 'body');
                };
            }
            var E = s ? this._.ka : this._.kp;
            if (x) w = function(F, G) {
                if (E(F, G) === false) return false;
                return x(F);
            };
            else w = E;
            if (this.current) u = this.current[z](false, y, w);
            else if (s) {
                u = v.endContainer;
                if (v.endOffset > 0) {
                    u = u.getChild(v.endOffset - 1);
                    if (w(u) === false) u = null;
                } else u = w(u) === false ? null : u.hZ(true, y, w);
            } else {
                u = v.startContainer;
                u = u.getChild(v.startOffset);
                if (u) {
                    if (w(u) === false) u = null;
                } else u = w(v.startContainer) === false ? null : v.startContainer.hL(true, y, w);
            }
            while (u && !this._.end) {
                this.current = u;
                if (!this.lf || this.lf(u) !== false) {
                    if (!t) return u;
                } else if (t && this.lf) return false;
                u = u[z](false, y, w);
            }
            this.end();
            return this.current = null;
        };

        function p(s) {
            var t, u = null;
            while (t = o.call(this, s)) u = t;
            return u;
        };
        h.gm = i.createClass({
            $: function(s) {
                this.mk = s;
                this._ = {};
            },
            ej: {
                end: function() {
                    this._.end = 1;
                },
                next: function() {
                    return o.call(this);
                },
                previous: function() {
                    return o.call(this, true);
                },
                sC: function() {
                    return o.call(this, false, true) !== false;
                },
                sD: function() {
                    return o.call(this, true, true) !== false;
                },
                uF: function() {
                    return p.call(this);
                },
                uB: function() {
                    return p.call(this, true);
                },
                reset: function() {
                    delete this.current;
                    this._ = {};
                }
            }
        });
        var q = {
                block: 1,
                'list-item': 1,
                table: 1,
                'table-row-group': 1,
                'table-header-group': 1,
                'table-footer-group': 1,
                'table-row': 1,
                'table-column-group': 1,
                'table-column': 1,
                'table-cell': 1,
                'table-caption': 1
            },
            r = {
                hr: 1
            };
        k.prototype.qy = function(s) {
            var t = i.extend({}, r, s || {});
            return q[this.getComputedStyle('display')] || t[this.getName()];
        };
        h.gm.pQ = function(s) {
            return function(t, u) {
                return !(t.type == a.cv && t.qy(s));
            };
        };
        h.gm.us = function() {
            return this.pQ({
                br: 1
            });
        };
        h.gm.tU = function(s) {}, h.gm.tW = function(s, t) {
            function u(v) {
                return v && v.getName && v.getName() == 'span' && v.hasAttribute('_fck_bookmark');
            };
            return function(v) {
                var w, x;
                w = v && !v.getName && (x = v.getParent()) && u(x);
                w = s ? w : w || u(v);
                return t ^ w;
            };
        };
        h.gm.sf = function(s) {
            return function(t) {
                var u = t && t.type == a.fl && !i.trim(t.getText());
                return s ^ u;
            };
        };
    })();
    (function() {
        if (f.webkit) {
            f.hc = false;
            return;
        }
        var o = k.kE('<div style="width:0px;height:0px;position:absolute;left:-10000px;border:1px solid;border-color:red blue;"></div>', a.document);
        o.appendTo(a.document.getHead());
        try {
            f.hc = o.getComputedStyle('border-top-color') == o.getComputedStyle('border-right-color');
        } catch (p) {
            f.hc = false;
        }
        if (f.hc) f.cssClass += ' cke_hc';
        o.remove();
    })();
    m.load(l.pO.split(','), function() {
        a.status = 'loaded';
        a.oW('loaded');
        var o = a._.io;
        if (o) {
            delete a._.io;
            for (var p = 0; p < o.length; p++) a.add(o[p]);
        }
    });
    if (g) try {
        document.execCommand('BackgroundImageCache', false, true);
    } catch (o) {}
    CKFinder.lang.en = {
        appTitle: 'CKFinder',
        common: {
            unavailable: '%1<span class="cke_accessibility">, unavailable</span>',
            confirmCancel: 'Some of the options were changed. Are you sure you want to close the dialog window?',
            ok: 'OK',
            cancel: 'Cancel',
            confirmationTitle: 'Confirmation',
            messageTitle: 'Information',
            inputTitle: 'Question',
            undo: 'Undo',
            redo: 'Redo',
            skip: 'Skip',
            skipAll: 'Skip all',
            makeDecision: 'What action should be taken?',
            rememberDecision: 'Remember my decision'
        },
        dir: 'ltr',
        HelpLang: 'en',
        LangCode: 'en',
        DateTime: 'm/d/yyyy h:MM aa',
        DateAmPm: ['AM', 'PM'],
        FoldersTitle: 'Folders',
        FolderLoading: 'Loading...',
        FolderNew: 'Please type the new folder name: ',
        FolderRename: 'Please type the new folder name: ',
        FolderDelete: 'Are you sure you want to delete the "%1" folder?',
        FolderRenaming: ' (Renaming...)',
        FolderDeleting: ' (Deleting...)',
        DestinationFolder: 'Destination Folder',
        FileRename: 'Please type the new file name: ',
        FileRenameExt: 'Are you sure you want to change the file extension? The file may become unusable.',
        FileRenaming: 'Renaming...',
        FileDelete: 'Are you sure you want to delete the file "%1"?',
        FilesDelete: 'Are you sure you want to delete %1 files?',
        FilesLoading: 'Loading...',
        FilesEmpty: 'The folder is empty.',
        DestinationFile: 'Destination File',
        SkippedFiles: 'List of skipped files:',
        BasketFolder: 'Basket',
        BasketClear: 'Clear Basket',
        BasketRemove: 'Remove from Basket',
        BasketOpenFolder: 'Open Parent Folder',
        BasketTruncateConfirm: 'Do you really want to remove all files from the basket?',
        BasketRemoveConfirm: 'Do you really want to remove the file "%1" from the basket?',
        BasketRemoveConfirmMultiple: 'Do you really want to remove %1 files from the basket?',
        BasketEmpty: 'No files in the basket, drag and drop some.',
        BasketCopyFilesHere: 'Copy Files from Basket',
        BasketMoveFilesHere: 'Move Files from Basket',
        OperationCompletedSuccess: 'Operation completed successfully.',
        OperationCompletedErrors: 'Operation completed with errors.',
        FileError: '%s: %e',
        MovedFilesNumber: 'Number of files moved: %s.',
        CopiedFilesNumber: 'Number of files copied: %s.',
        MoveFailedList: 'The following files could not be moved:<br />%s',
        CopyFailedList: 'The following files could not be copied:<br />%s',
        Upload: 'Upload',
        UploadTip: 'Upload New File',
        Refresh: 'Refresh',
        Settings: 'Settings',
        Help: 'Help',
        HelpTip: 'Help',
        Select: 'Select',
        SelectThumbnail: 'Select Thumbnail',
        View: 'View',
        Download: 'Download',
        NewSubFolder: 'New Subfolder',
        Rename: 'Rename',
        Delete: 'Delete',
        DeleteFiles: 'Delete Files',
        CopyDragDrop: 'Copy Here',
        MoveDragDrop: 'Move Here',
        RenameDlgTitle: 'Rename',
        NewNameDlgTitle: 'New Name',
        FileExistsDlgTitle: 'File Already Exists',
        SysErrorDlgTitle: 'System Error',
        FileOverwrite: 'Overwrite',
        FileAutorename: 'Auto-rename',
        ManuallyRename: 'Manually rename',
        OkBtn: 'OK',
        CancelBtn: 'Cancel',
        CloseBtn: 'ns',
        UploadTitle: 'Upload New File',
        UploadSelectLbl: 'Select a file to upload',
        UploadProgressLbl: '(Upload in progress, please wait...)',
        UploadBtn: 'Upload Selected File',
        UploadBtnCancel: 'Cancel',
        UploadNoFileMsg: 'Please select a file from your computer.',
        UploadNoFolder: 'Please select a folder before uploading.',
        UploadNoPerms: 'File upload not allowed.',
        UploadUnknError: 'Error sending the file.',
        UploadExtIncorrect: 'File extension not allowed in this folder.',
        UploadLabel: 'Files to Upload',
        UploadTotalFiles: 'Total Files:',
        UploadTotalSize: 'Total Size:',
        UploadSend: 'Upload',
        UploadAddFiles: 'Add Files',
        UploadClearFiles: 'Clear Files',
        UploadCancel: 'Cancel Upload',
        UploadRemove: 'Remove',
        UploadRemoveTip: 'Remove !f',
        UploadUploaded: 'Uploaded !n%',
        UploadProcessing: 'Processing...',
        SetTitle: 'Settings',
        SetView: 'View:',
        SetViewThumb: 'Thumbnails',
        SetViewList: 'List',
        SetDisplay: 'Display:',
        SetDisplayName: 'File Name',
        SetDisplayDate: 'Date',
        SetDisplaySize: 'File Size',
        SetSort: 'Sorting:',
        SetSortName: 'by File Name',
        SetSortDate: 'by Date',
        SetSortSize: 'by Size',
        SetSortExtension: 'by Extension',
        FilesCountEmpty: '<Empty Folder>',
        FilesCountOne: '1 file',
        FilesCountMany: '%1 files',
        Kb: '%1 KB',
        Mb: '%1 MB',
        Gb: '%1 GB',
        SizePerSecond: '%1/s',
        ErrorUnknown: 'It was not possible to complete the request. (Error %1)',
        Errors: {
            10: 'Invalid command.',
            11: 'The resource type was not specified in the request.',
            12: 'The requested resource type is not valid.',
            102: 'Invalid file or folder name.',
            103: 'It was not possible to complete the request due to authorization restrictions.',
            104: 'It was not possible to complete the request due to file system permission restrictions.',
            105: 'Invalid file extension.',
            109: 'Invalid request.',
            110: 'Unknown error.',
            111: 'It was not possible to complete the request due to resulting file size.',
            115: 'A file or folder with the same name already exists.',
            116: 'Folder not found. Please refresh and try again.',
            117: 'File not found. Please refresh the files list and try again.',
            118: 'Source and target paths are equal.',
            201: 'A file with the same name is already available. The uploaded file was renamed to "%1".',
            202: 'Invalid file.',
            203: 'Invalid file. The file size is too big.',
            204: 'The uploaded file is corrupt.',
            205: 'No temporary folder is available for upload in the server.',
            206: 'Upload cancelled due to security reasons. The file contains HTML-like data.',
            207: 'The uploaded file was renamed to "%1".',
            300: 'Moving file(s) failed.',
            301: 'Copying file(s) failed.',
            500: 'The file browser is disabled for security reasons. Please contact your system administrator and check the CKFinder configuration file.',
            501: 'The thumbnails support is disabled.'
        },
        ErrorMsg: {
            pg: 'The file name cannot be empty.',
            FileExists: 'File %s already exists.',
            FolderEmpty: 'The folder name cannot be empty.',
            FolderExists: 'Folder %s already exists.',
            FolderNameExists: 'Folder already exists.',
            oP: 'The file name cannot contain any of the following characters: \n\\ / : * ? " < > |',
            FolderInvChar: 'The folder name cannot contain any of the following characters: \n\\ / : * ? " < > |',
            oo: 'It was not possible to open the file in a new window. Please configure your browser and disable all popup blockers for this site.',
            XmlError: 'It was not possible to properly load the XML response from the web server.',
            XmlEmpty: 'It was not possible to load the XML response from the web server. The server returned an empty response.',
            XmlRawResponse: 'Raw response from the server: %s'
        },
        Imageresize: {
            dialogTitle: 'Resize %s',
            sizeTooBig: 'Cannot set image height or width to a value bigger than the original size (%size).',
            resizeSuccess: 'Image resized successfully.',
            thumbnailNew: 'Create a new thumbnail',
            thumbnailSmall: 'Small (%s)',
            thumbnailMedium: 'Medium (%s)',
            thumbnailLarge: 'Large (%s)',
            newSize: 'Set a new size',
            width: 'Width',
            height: 'Height',
            invalidHeight: 'Invalid height.',
            invalidWidth: 'Invalid width.',
            invalidName: 'Invalid file name.',
            newImage: 'Create a new image',
            noExtensionChange: 'File extension cannot be changed.',
            imageSmall: 'Source image is too small.',
            contextMenuName: 'Resize',
            lockRatio: 'Lock ratio',
            resetSize: 'Reset size'
        },
        Fileeditor: {
            save: 'Save',
            fileOpenError: 'Unable to open file.',
            fileSaveSuccess: 'File saved successfully.',
            contextMenuName: 'Edit',
            loadingFile: 'Loading file, please wait...'
        },
        Maximize: {
            maximize: 'Maximize',
            minimize: 'Minimize'
        },
        Gallery: {
            current: 'Image {current} of {total}'
        },
        Zip: {
            extractHereLabel: 'Extract here',
            extractToLabel: 'Extract to...',
            downloadZipLabel: 'Download as zip',
            compressZipLabel: 'Compress to zip',
            removeAndExtract: 'Remove existing and extract',
            extractAndOverwrite: 'Extract overwriting existing files',
            extractSuccess: 'File extracted successfully.'
        }
    };
    (function() {
        var p = 1,
            q = 2,
            r = 4,
            s = 8,
            t = 16,
            u = 32,
            v = 64,
            w = 128;
        a.aL.Acl = function(x) {
            var y = this;
            if (!x) x = 0;
            y.folderView = (x & p) == p;
            y.folderCreate = (x & q) == q;
            y.folderRename = (x & r) == r;
            y.folderDelete = (x & s) == s;
            y.fileView = (x & t) == t;
            y.fileUpload = (x & u) == u;
            y.fileRename = (x & v) == v;
            y.fileDelete = (x & w) == w;
        };
        m.add('acl');
    })();
    (function() {
        m.add('connector', {
            bM: [],
            bz: function(q) {
                q.on('appReady', function() {
                    q.connector = new a.aL.Connector(q);
                    var r = q.config.resourceType,
                        s = r ? {
                            type: r
                        } : null;
                    q.connector.sendCommand('Init', s, function(t) {
                        var u;
                        if (t.checkError()) return;
                        var v = "\103\x6f\x6e\x6e\x65\143\164\x6f\x72\057\103\157\x6e\156\145\143\x74\x6f\162\111\x6e\146\x6f\057";
                        a.ed = t.selectSingleNode(v + "\100\x73").value;
                        a.bF = t.selectSingleNode(v + "\x40\x63").value + '----';
                        q.config.thumbsEnabled = t.selectSingleNode(v + "\x40\164\x68\165\155\142\163\105\156\x61\x62\154\145\144").value == 'true';
                        q.config.thumbsDirectAccess = false;
                        if (q.config.thumbsEnabled) {
                            u = t.selectSingleNode(v + "\x40\x74\150\x75\155\142\x73\x55\162\154");
                            if (u) q.config.thumbsUrl = u.value;
                            u = t.selectSingleNode(v + "\x40\x74\x68\165\x6d\x62\x73\104\x69\x72\x65\143\x74\101\x63\143\145\163\x73");
                            if (u) q.config.thumbsDirectAccess = u.value == 'true';
                            u = t.selectSingleNode(v + "\x40\164\150\165\x6d\x62\x73\x57\x69\144\x74\150");
                            q.config.thumbsWidth = (u ? parseInt(u.value, 10) : 100) || 100;
                            u = t.selectSingleNode(v + "\x40\164\x68\165\x6d\142\x73\110\x65\151\147\x68\x74");
                            q.config.thumbsHeight = (u ? parseInt(u.value, 10) : 100) || 100;
                        }
                        q.config.imagesMaxWidth = parseInt(t.selectSingleNode(v + "\100\151\x6d\x67\127\151\144\x74\x68").value, 10);
                        q.config.imagesMaxHeight = parseInt(t.selectSingleNode(v + "\100\x69\x6d\x67\x48\145\151\147\x68\x74").value, 10);
                        u = t.selectSingleNode(v + "\100\x75\x70\x6c\x6f\141\144\x4d\x61\x78\123\151\x7a\x65");
                        q.config.uploadMaxSize = u ? parseInt(u.value, 10) : 0;
                        u = t.selectSingleNode(v + "\100\x75\x70\154\x6f\x61\x64\x43\150\145\x63\153\x49\155\141\x67\145\x73");
                        q.config.uploadCheckImages = u ? u.value == 'true' : false;
                        var w = t.selectSingleNode(v + "\100\x70\154\165\x67\x69\156\163"),
                            x = w && w.value;
                        if (x && x.length) m.load(x.split(','), function(y) {
                            var z = [],
                                A = [],
                                B = [];
                            for (var C in y) {
                                var D = y[C],
                                    E = D.lang,
                                    F = m.getPath(C),
                                    G = null;
                                if (!q.plugins[C]) q.plugins[C] = y[C];
                                else continue;
                                y[C].name = C;
                                D.pathName = F;
                                if (E) {
                                    G = i.indexOf(E, q.langCode) >= 0 ? q.langCode : E[0];
                                    if (!D.lang[G]) B.push(a.getUrl(F + 'lang/' + G + '.js'));
                                    else {
                                        i.extend(q.lang, D.lang[G]);
                                        G = null;
                                    }
                                }
                                A.push(G);
                                z.push(D);
                            }
                            a.scriptLoader.load(B, function() {
                                var H = ['eK', 'bz', 'gr'];
                                for (var I = 0; I < H.length; I++) for (var J = 0; J < z.length; J++) {
                                    var K = z[J];
                                    if (I === 0 && A[J] && K.lang) i.extend(q.lang, K.lang[A[J]]);
                                    if (K[H[I]]) {
                                        a.log('[PLUGIN] ' + K.name + '.' + H[I]);
                                        K[H[I]](q);
                                    }
                                }
                                q.cr('uiReady');
                                q.cr('appReady');
                                q.oW('pluginsLoaded', {
                                    step: 2,
                                    jN: q.connector
                                });
                                q.cr('connectorInitialized', {
                                    xml: t
                                });
                            });
                        });
                        else {
                            q.oW('pluginsLoaded', {
                                step: 2,
                                jN: q.connector
                            });
                            q.cr('connectorInitialized', {
                                xml: t
                            });
                        }
                    });
                });
            }
        });
        a.aL.Connector = function(q) {
            this.app = q;
            var r = q.config.connectorLanguage || 'php';
            if (q.config.connectorPath) this.oN = q.config.connectorPath;
            else this.oN = a.basePath + 'core/connector/' + r + '/connector.' + r;
        };
        a.aL.Connector.prototype = {
            ERROR_NONE: 0,
            ERROR_CUSTOMERROR: 1,
            ERROR_INVALIDCOMMAND: 10,
            ERROR_TYPENOTSPECIFIED: 11,
            ERROR_INVALIDTYPE: 12,
            ERROR_INVALIDNAME: 102,
            ERROR_UNAUTHORIZED: 103,
            ERROR_ACCESSDENIED: 104,
            ERROR_INVALIDEXTENSION: 105,
            ERROR_INVALIDREQUEST: 109,
            ERROR_UNKNOWN: 110,
            ERROR_ALREADYEXIST: 115,
            ERROR_FOLDERNOTFOUND: 116,
            ERROR_FILENOTFOUND: 117,
            ERROR_SOURCE_AND_TARGET_PATH_EQUAL: 118,
            ERROR_UPLOADEDFILERENAMED: 201,
            ERROR_UPLOADEDINVALID: 202,
            ERROR_UPLOADEDTOOBIG: 203,
            ERROR_UPLOADEDCORRUPT: 204,
            ERROR_UPLOADEDNOTMPDIR: 205,
            ERROR_UPLOADEDWRONGHTMLFILE: 206,
            ERROR_UPLOADEDINVALIDNAMERENAMED: 207,
            ERROR_MOVE_FAILED: 300,
            ERROR_COPY_FAILED: 301,
            ERROR_CONNECTORDISABLED: 500,
            ERROR_THUMBNAILSDISABLED: 501,
            currentFolderUrl: function() {
                if (this.app.aV) return this.app.aV.getUrl();
            },
            currentType: function() {
                if (this.app.aV) return this.app.aV.type;
            },
            currentTypeHash: function() {
                if (this.app.aV) return a.getResourceType(this.app.aV.type).hash;
            },
            currentResourceType: function() {
                return a.getResourceType(this.currentType());
            },
            sendCommand: function(q, r, s, t, u) {
                var v = this.composeUrl(q, r, t, u),
                    w = this;
                if (s) return a.ajax.loadXml(v, function(x) {
                    x.hy = w.app;
                    w.app.oW('connectorResponse', {
                        xml: x
                    });
                    s(i.extend(x, p));
                });
                else return a.ajax.loadXml(v, function(x) {
                    w.app.oW('connectorResponse', {
                        xml: x
                    });
                });
            },
            sendCommandPost: function(q, r, s, t, u, v) {
                var w = this.composeUrl(q, r, u, v),
                    x = this;
                if (!s) s = {};
                s.CKFinderCommand = true;
                if (t) return a.ajax.loadXml(w, function(y) {
                    y.hy = x.app;
                    x.app.oW('connectorResponse', {
                        xml: y
                    });
                    t(i.extend(y, p));
                }, this.composeUrlParams(s));
                else return a.ajax.loadXml(w, function(y) {
                    x.app.oW('connectorResponse', {
                        xml: y
                    });
                }, this.composeUrlParams(s));
            },
            composeUrl: function(q, r, s, t) {
                var x = this;
                var u = x.oN + '?command=' + encodeURIComponent(q);
                if (q != 'Init') {
                    var v = '';
                    if (!t) t = x.app.aV;
                    if (s) v = x.app.getResourceType(s).hash;
                    else v = x.app.getResourceType(t.type).hash;
                    u += '&type=' + encodeURIComponent(s || x.app.aV.type) + '&currentFolder=' + encodeURIComponent(t.getPath() || '') + '&langCode=' + x.app.langCode + '&hash=' + v;
                }
                if (r) {
                    var w = x.composeUrlParams(r);
                    if (w) u += '&' + w;
                }
                if (x.app.id) u += '&id=' + encodeURIComponent(x.app.id);
                if (x.app.config.connectorInfo) u += (x.app.config.connectorInfo.charAt(0) != '&' ? '&' : '') + x.app.config.connectorInfo;
                return u;
            },
            composeUrlParams: function(q) {
                if (!q) return '';
                var r = '';
                for (var s in q) {
                    if (r.length) r += '&';
                    r += encodeURIComponent(s) + '=' + encodeURIComponent(q[s]);
                }
                return r;
            }
        };
        var p = {
            checkError: function() {
                var w = this;
                var q = w.getErrorNumber(),
                    r = w.hy.connector;
                if (q == r.ERROR_NONE) return false;
                if (q === -1) return true;
                var s = w.getErrorMessage();
                a.log('[ERROR] ' + q);
                var t;
                if (q == r.ERROR_CUSTOMERROR) t = s;
                else {
                    t = w.hy.lang.Errors[q];
                    if (t) for (var u = 0; u <= arguments.length; u++) {
                        var v = u === 0 ? s : arguments[u - 1];
                        t = t.replace(/%(\d+)/, v);
                    } else t = w.hy.lang.ErrorUnknown.replace(/%1/, q);
                }
                w.hy.msgDialog('', t);
                return q != r.ERROR_UPLOADEDFILERENAMED;
            },
            getErrorNumber: function() {
                var q = this.selectSingleNode && this.selectSingleNode('Connector/Error/@number');
                if (!q) return -1;
                return parseInt(q.value, 10);
            },
            getErrorMessage: function() {
                var q = this.selectSingleNode && this.selectSingleNode('Connector/Error/@text');
                if (!q) return '';
                return q.value;
            }
        };
    })();
    m.add('resource', {
        bM: ['connector'],
        bz: function(p) {
            p.resourceTypes = [];
            p.on('connectorInitialized', function(q) {
                var r = q.data.xml.selectNodes('Connector/ResourceTypes/ResourceType');
                for (var s = 0; s < r.length; s++) {
                    var t = r[s].attributes;
                    p.resourceTypes.push(new a.aL.ResourceType(p, {
                        name: t.getNamedItem('name').value,
                        url: t.getNamedItem('url').value,
                        hasChildren: t.getNamedItem('hasChildren').value,
                        allowedExtensions: t.getNamedItem('allowedExtensions').value,
                        deniedExtensions: t.getNamedItem('deniedExtensions').value,
                        acl: t.getNamedItem('acl').value,
                        hash: t.getNamedItem('hash').value,
                        maxSize: t.getNamedItem('maxSize').value
                    }));
                }
                p.cr('resourcesReceived', {
                    hK: p.resourceTypes
                });
            });
            p.getResourceType = function(q) {
                for (var r = 0; r < this.resourceTypes.length; r++) {
                    var s = this.resourceTypes[r];
                    if (s.name == q) return s;
                }
                return null;
            };
        }
    });
    (function() {
        a.aL.ResourceType = function(q, r) {
            var s = this;
            s.app = q;
            s.name = r.name;
            s.url = r.url;
            s.hasChildren = r.hasChildren === 'true';
            s.defaultView = 'Thumbnails';
            s.allowedExtensions = r.allowedExtensions;
            s.deniedExtensions = r.deniedExtensions;
            s.oT = p(r.allowedExtensions);
            s.ms = p(r.deniedExtensions);
            s.nS = r.acl;
            s.hash = r.hash;
            s.maxSize = r.maxSize;
        };
        a.aL.ResourceType.prototype = {
            isExtensionAllowed: function(q) {
                var r = this;
                q = q.toLowerCase();
                return (r.deniedExtensions.length === 0 || !r.ms[q]) && (r.allowedExtensions.length === 0 || !!r.oT[q]);
            },
            allowedExtensions: function() {
                return this.allowedExtensions;
            },
            getRootFolder: function() {
                for (var q = 0; q < this.app.folders.length; q++) {
                    var r = this.app.folders[q];
                    if (r.isRoot && r.type == this.name) return r;
                }
                return undefined;
            }
        };

        function p(q) {
            var r = {};
            if (q.length > 0) {
                var s = q.toLowerCase().split(',');
                for (var t = 0; t < s.length; t++) r[s[t]] = true;
            }
            return r;
        };
    })();
    (function() {
        var p = {
            iz: /[\\\/:\*\?"<>\|]/
        };
        m.add('folder', {
            bM: ['resource', 'connector', 'acl'],
            bz: function(s) {
                s.folders = [];
                s.aV = null;
                s.on('resourcesReceived', function y(t) {
                    var u = [],
                        v = t.data.hK;
                    for (var w = 0; w < v.length; w++) {
                        var x = v[w];
                        u.push(new a.aL.Folder(s, x.name, x.name, x.hasChildren, x.nS));
                        u[u.length - 1].isRoot = true;
                    }
                    s.oW('requestAddFolder', {
                        folders: u
                    }, function H() {
                        var z = s.config.startupPath || '',
                            A = 0,
                            B = '',
                            C = '';
                        if (s.config.rememberLastFolder) {
                            var D = s.id ? 'CKFinder_Path_' + s.id : 'CKFinder_Path';
                            B = decodeURIComponent(i.getCookie(D)) || '';
                        }
                        if (z && !s.qn) {
                            C = z;
                            A = 1;
                        } else if (B) C = B;
                        else if (z) C = z;
                        else if (s.resourceTypes.length) C = s.resourceTypes[0].name + '/';
                        if (C) {
                            a.log('[FOLDER] Opening startup path: ' + C);
                            var E = C.split(':');
                            if (!s.getResourceType(E[0]) || E.length < 2) E = [s.resourceTypes[0].name, '/'];
                            var F = s.aG['foldertree.foldertree'],
                                G = /(.*\/)(.*)$/.exec(E[1]);
                            F.tools.jL(E[0], G[1], function K(I) {
                                if (!I) return;
                                a.log('[FOLDER] Opening startup folder: ', I);
                                var J = !A && (E[2] == '1' || E[2] === undefined);
                                if (J && s.config.startupFolderExpanded === false) J = 0;
                                F.oW('requestSelectFolder', {
                                    folder: I,
                                    expand: J,
                                    file: G[2] && I.type == E[0] && I.getPath() == G[1] ? G[2] : ''
                                });
                            });
                        }
                    });
                });
                s.bD('RemoveFolder', {
                    readOnly: false,
                    exec: function(t) {
                        var u = t.aV;
                        if (u) {
                            if (u.isRoot || !u.acl.folderDelete) return;
                            t.fe('', t.lang.FolderDelete.replace('%1', u.name), function() {
                                t.oW('requestProcessingFolder', {
                                    folder: u
                                });
                                u.remove();
                            });
                        }
                    }
                });
                s.bD('CreateSubFolder', {
                    readOnly: false,
                    exec: function(t) {
                        var u = t.aV;
                        if (u) t.hs(t.lang.NewNameDlgTitle, t.lang.FolderRename, '', function(v) {
                            v = i.trim(v);
                            if (v) try {
                                t.oW('requestProcessingFolder', {
                                    folder: u
                                });
                                u.createNewFolder(v);
                            } catch (w) {
                                if (w instanceof a.dU) {
                                    t.oW('requestRepaintFolder', {
                                        folder: u
                                    });
                                    t.msgDialog('', w.message);
                                } else throw w;
                            }
                        });
                    }
                });
                s.bD('RenameFolder', {
                    readOnly: false,
                    exec: function(t) {
                        var u = t.aV;
                        if (u) {
                            if (u.isRoot || !u.acl.folderRename) return;
                            t.hs(t.lang.RenameDlgTitle, t.lang.FolderRename, t.aV.name, function(v) {
                                v = i.trim(v);
                                if (v) try {
                                    u.rename(v);
                                } catch (w) {
                                    if (w instanceof a.dU) {
                                        t.oW('requestRepaintFolder', {
                                            folder: u
                                        });
                                        t.msgDialog('', w.message);
                                    } else throw w;
                                }
                            });
                        }
                    }
                });
                if (s.eU) {
                    s.dZ('folder0', 99);
                    s.dZ('folder1', 100);
                    s.dZ('folder2', 101);
                    s.dZ('folder3', 102);
                    s.eU({
                        kl: {
                            label: s.lang.NewSubFolder,
                            command: 'CreateSubFolder',
                            group: 'folder1'
                        },
                        lI: {
                            label: s.lang.Rename,
                            command: 'RenameFolder',
                            group: 'folder1'
                        },
                        removeFolder: {
                            label: s.lang.Delete,
                            command: 'RemoveFolder',
                            group: 'folder2'
                        }
                    });
                }
            }
        });
        a.aL.Folder = function(s, t, u, v, w) {
            var x = this;
            x.app = s;
            x.type = t || '';
            x.name = u || '';
            x.hasChildren = v == undefined || v === null ? true : !!v;
            x.isRoot = false;
            x.isOpened = false;
            x.parent = null;
            x.isDirty = false;
            x.acl = new a.aL.Acl(w);
            x.index = s.folders.push(x) - 1;
            x.childFolders = null;
        };

        function q(s, t, u, v, w) {
            if (s.childFolders === null) s.childFolders = [];
            var x = new a.aL.Folder(s.app, t, u, v, w);
            x.parent = s;
            x.nh = s.isRoot ? 0 : s.nh + 1;
            s.childFolders.push(x);
            return x;
        };
        a.aL.Folder.prototype = {
            getPath: function() {
                var s = this,
                    t = s.isRoot ? '/' : s.name;
                while (s.parent) {
                    s = s.parent;
                    t = s.isRoot ? '/' + t : s.name + '/' + t;
                }
                return s != this ? t + '/' : t;
            },
            getUrl: function() {
                var s = this,
                    t = '';
                while (s) {
                    t = s.isRoot ? this.app.getResourceType(s.type).url + t : encodeURIComponent(s.name) + '/' + t;
                    s = s.parent;
                }
                return t;
            },
            getUploadUrl: function() {
                return this.app.connector.composeUrl('FileUpload', {}, this.type, this);
            },
            getResourceType: function() {
                return this.app.getResourceType(this.type);
            },
            updateReference: function() {
                var t = this;
                if (t.app.folders[t.index] == t) return t;
                for (var s = 0; s < t.parent.childFolders.length; s++) {
                    if (t.parent.childFolders[s].name == t.name) return t.parent.childFolders[s];
                }
                return undefined;
            },
            getChildren: function(s, t) {
                var u = this,
                    v = u.childFolders;
                if (u.hl && !t) {
                    a.log('[FOLDER] getChildrenLock active, defering callback...');
                    u.app.oW('requestLoadingFolder', {
                        folder: u
                    });
                    var w = 100;
                    setTimeout(function() {
                        if (!u.hl) s(v);
                        else if (w <= 3000) setTimeout(arguments.callee, w *= 2);
                        else {
                            a.log('[FOLDER] TIMEOUT for getChildrenLock defered callback!');
                            u.hl = false;
                            u.getChildren(s);
                        }
                    });
                    return undefined;
                }
                if (v && !u.isDirty && !t) {
                    s(v);
                    return v;
                }
                u.hl = true;
                if (u.isDirty && v) {
                    a.log('[FOLDER] Clearing folder children cache.');
                    for (var x = 0; x < v.length; x++) delete u.app.folders[v[x].index];
                }
                u.app.oW('requestLoadingFolder', {
                    folder: u
                });
                this.app.connector.sendCommand('GetFolders', null, function(y) {
                    if (y.checkError()) {
                        u.app.oW('requestRepaintFolder', {
                            folder: u
                        });
                        return;
                    }
                    var z = y.selectSingleNode('Connector/@resourceType').value;
                    u.hm = true;
                    var A = y.selectNodes('Connector/Folders/Folder'),
                        B = [];
                    u.childFolders = null;
                    for (var C = 0; C < A.length; C++) {
                        var D = A[C].attributes.getNamedItem('name').value,
                            E = A[C].attributes.getNamedItem('hasChildren').value == 'true',
                            F = parseInt(A[C].attributes.getNamedItem('acl').value, 10);
                        B.push(q(u, z, D, E, F));
                    }
                    u.hasChildren = !!A.length;
                    u.isDirty = false;
                    u.hl = null;
                    u.app.oW('requestRepaintFolder', {
                        folder: u
                    });
                    s(B);
                }, u.type, u);
                return null;
            },
            mapLoadedDescendants: function(s) {
                if (!this.childFolders) return;
                for (var t = 0; t < this.childFolders.length; t++) {
                    var u = this.childFolders[t];
                    u.mapLoadedDescendants(s);
                    s(u);
                }
            },
            select: function() {
                this.app.oW('requestSelectFolder', {
                    folder: this
                });
            },
            isSelected: function() {
                return this.app.aV && this == this.app.aV;
            },
            deselect: function() {
                this.app.oW('requestSelectFolder');
            },
            open: function(s) {
                if (s && !this.hm) return;
                this.app.oW('requestExpandFolder', {
                    folder: this
                });
            },
            close: function() {
                this.app.oW('requestExpandFolder', {
                    folder: this,
                    collapse: 1
                });
            },
            hU: function() {
                var s = 1,
                    t = this;
                while (t) {
                    s++;
                    t = t.parent;
                }
                return s;
            },
            toggle: function() {
                var s = this;
                if (!s.hasChildren) return;
                if (s.isOpened) s.close();
                else s.open();
            },
            createNewFolder: function(s) {
                r(s, this.app);
                var t = this;
                t.isDirty = true;
                t.app.connector.sendCommandPost('CreateFolder', {
                    NewFolderName: s
                }, null, function(u) {
                    if (u.checkError()) {
                        t.app.oW('requestRepaintFolder', {
                            folder: t
                        });
                        return;
                    }
                    t.hasChildren = true;
                    t.app.oW('afterCommandExecDefered', {
                        name: 'CreateFolder',
                        ip: t,
                        uv: s
                    });
                }, this.type, this);
            },
            rename: function(s) {
                r(s, this.app);
                var t = this;
                this.app.oW('requestProcessingFolder', {
                    folder: t
                });
                t.parent.isDirty = true;
                if (t.name == s) {
                    t.app.oW('requestRepaintFolder', {
                        folder: t
                    });
                    return;
                }
                t.app.connector.sendCommandPost('RenameFolder', {
                    NewFolderName: s
                }, null, function(u) {
                    if (u.checkError()) {
                        t.app.oW('requestRepaintFolder', {
                            folder: t
                        });
                        return;
                    }
                    t.parent.isDirty = false;
                    t.name = u.selectSingleNode('Connector/RenamedFolder/@newName').value;
                    t.app.oW('requestRepaintFolder', {
                        folder: t
                    });
                }, this.type, this);
            },
            remove: function() {
                var s = this;
                s.deselect();
                s.parent.isDirty = true;
                this.app.oW('requestProcessingFolder', {
                    folder: s
                });
                s.app.connector.sendCommandPost('DeleteFolder', null, null, function(t) {
                    if (t.checkError()) {
                        s.app.oW('requestRepaintFolder', {
                            folder: s
                        });
                        return;
                    }
                    s.app.oW('requestRemoveFolder', {
                        folder: s
                    }, function() {
                        var u = i.indexOf(s.parent.childFolders, s),
                            v = s.index,
                            w = s.parent,
                            x = s.app;
                        w.childFolders[u].mapLoadedDescendants(function(y) {
                            x.folders[y.index].isDeleted = true;
                            delete x.folders[y.index];
                        });
                        w.childFolders.splice(u, 1);
                        x.folders[v].isDeleted = true;
                        delete x.folders[v];
                        if (w.childFolders.length === 0) {
                            w.childFolders = null;
                            w.hasChildren = false;
                        }
                        if (s.releaseDomNodes) s.releaseDomNodes();
                        x.oW('afterCommandExecDefered', {
                            name: 'RemoveFolder',
                            ip: w,
                            uN: v,
                            folder: s
                        });
                    });
                }, this.type, this);
            },
            'toString': function() {
                return this.getPath();
            }
        };

        function r(s, t) {
            if (!s || s.length === 0) throw new a.dU('name_empty', t.lang.ErrorMsg.FolderEmpty);
            if (p.iz.test(s)) throw new a.dU('name_invalid_chars', t.lang.ErrorMsg.FolderInvChar);
            return true;
        };
    })();
    (function() {
        var p = '<a href="javascript:void(0)" class="dropdown">▼</a>';
        m.add('foldertree', {
            bM: ['folder'],
            onLoad: function x() {
                q();
                r();
            },
            bz: function z(x) {
                var y = this;
                x.on('themeSpace', function B(A) {
                    if (A.data.space == 'sidebar') A.data.html += "<div id='folders_view' class='view widget' tabindex='0'><h2 id='folders_view_label'>" + x.lang.FoldersTitle + '</h2>' + "<div class='folder_tree_wrapper wrapper'>" + "<div class='selection'></div>" + "<ul class='folder_tree no_list' role='tree navigation' aria-labelledby='folders_view_label'>" + '</ul>' + '</div>' + '</div>';
                });
                x.on('uiReady', function D(A) {
                    if (!x.config.showContextMenuArrow) p = '';
                    var B = x.document.getById('folders_view');
                    B.hX();
                    f.opera && B.on('dblclick', function(E) {
                        E.data.preventDefault();
                    });
                    var C = a.aG.bz(x, 'foldertree', y, B);
                    if (x.bj) {
                        x.bj.lX(B);
                        x.bj.kh(function M(E, F) {
                            if (E.dS() == 'folders_view') return undefined;
                            var G = true;
                            if (x.aV) {
                                var H = x.aV.liNode().dS();
                                if (E.dS() === H || E.getParent().dS() === H) G = false;
                            }
                            if (G) {
                                x.oW('requestSelectFolder', {
                                    folder: null
                                });
                                x.oW('requestSelectFolder', {
                                    folder: E
                                });
                            }
                            var I = x.aV;
                            if (I && !x.config.readOnly) {
                                var J = I.acl,
                                    K = I.isRoot,
                                    L = {
                                        kl: J.folderCreate ? a.aS : a.aY,
                                        lI: !K && J.folderRename ? a.aS : a.aY,
                                        removeFolder: !K && J.folderDelete ? a.aS : a.aY
                                    };
                                C.oW('beforeContextMenu', {
                                    bj: L,
                                    folder: I
                                });
                                return L;
                            }
                        }, B);
                    }
                });
                x.bD('foldertreeFocus', {
                    exec: function(A) {
                        var B = A.layout.pS(),
                            C = A.aG['foldertree.foldertree'],
                            D = C.tools.ew;
                        B.focus();
                        D && D.focus();
                    }
                });
            }
        });

        function q() {
            var x = a.aG.hS('foldertree', 'foldertree');
            x.dT.push(function() {
                var z = this.bn();
                if (!z.hasClass('view')) z = z.getParent();
                i.mH(z);
            });
            x.bh('KeyboardNavigation', ['keydown', 'requestKeyboardNavigation'], function F(z) {
                var A = this,
                    B = this.tools.cq(z),
                    C = 0;
                if (z.data && z.data.bK) {
                    var D = z.data.bK();
                    C = D.$ == A.bn().$;
                }
                if (!B && !C) return;
                var E = i.extend({}, z.data, {
                    folder: B
                }, true);
                this.oW('beforeKeyboardNavigation', E, function M(G, H) {
                    if (G) return;
                    try {
                        var I = z.data.db();
                        if (C && I >= 37 && I <= 40) {
                            var J = A.app.folders[0];
                            if (J) this.tools.cT(J);
                        } else {
                            var K;
                            if (I == 38) {
                                z.data.preventDefault();
                                K = B.liNode();
                                if (K.gE()) {
                                    var L = this.tools.cq(K.cf());
                                    while (L.isOpened && L.hasChildren) {
                                        if (L.childFolders.length) L = L.childFolders[L.childFolders.length - 1];
                                        else break;
                                    }
                                    this.tools.cT(L);
                                } else if (!B.isRoot) this.tools.cT(B.parent);
                            } else if (I == 39 && B.hasChildren) {
                                if (B.isOpened) B.getChildren(function(N) {
                                    A.tools.cT(N[0]);
                                });
                                else this.oW('requestExpandFolder', {
                                    folder: B
                                });
                            } else if (I == 40) {
                                z.data.preventDefault();
                                K = B.liNode();
                                if (B.isOpened && B.hasChildren) B.getChildren(function(N) {
                                    A.tools.cT(N[0]);
                                });
                                else if (K.ge()) this.tools.cT(this.tools.cq(K.dG()));
                                else if (!B.isRoot && B.parent)(function(N) {
                                    var O = N.liNode();
                                    if (O.ge()) A.tools.cT(A.tools.cq(O.dG()));
                                    else if (N.parent) arguments.callee(N.parent);
                                })(B.parent);
                            } else if (I == 37) {
                                if (B.isOpened) this.oW('requestExpandFolder', {
                                    folder: B,
                                    collapse: 1
                                });
                                else if (!B.isRoot && B.parent) this.tools.cT(B.parent);
                            } else if (I == 46) {
                                A.app.oW('requestSelectFolder', {
                                    folder: B
                                });
                                A.app.execCommand('RemoveFolder');
                            } else if (I == 113) {
                                A.app.oW('requestSelectFolder', {
                                    folder: B
                                });
                                A.app.execCommand('RenameFolder');
                            }
                        }
                        this.oW('successKeyboardNavigation', H);
                        this.oW('afterKeyboardNavigation', H);
                    } catch (N) {
                        N = a.ba(N);
                        this.oW('failedKeyboardNavigation', H);
                        this.oW('afterKeyboardNavigation', H);
                        throw N;
                    }
                });
            });
            x.dT.push(function(z, A) {
                z.on('afterCommandExecDefered', function(B) {
                    if (!B.data) return;
                    var C = B.data.folder;
                    if (B.data.name == 'RemoveFolder') {
                        if (C == A.tools.ew) {
                            A.tools.cT();
                            A.bn().focus();
                        }
                        var D = z.aG['filesview.filesview'].tools.folder,
                            E = C == D;
                        C.mapLoadedDescendants(function(F) {
                            if (D == C) E = true;
                        });
                        A.oW('requestSelectFolder', {
                            folder: C.parent,
                            expand: E
                        });
                    } else if (B.data.name == 'RenameFolder') if (C == A.tools.ew) C.focus();
                });
            });
            x.bh('RemoveFolder', 'requestRemoveFolder', function D(z) {
                var A = this,
                    B = this.tools.cq(z),
                    C = i.extend({}, z.data, {
                        folder: B
                    }, true);
                this.oW('beforeRemoveFolder', C, function G(E, F) {
                    var H = this;
                    if (E) return;
                    try {
                        B.liNode().remove();
                        H.oW('successRemoveFolder', F);
                        H.oW('afterRemoveFolder', F);
                    } catch (I) {
                        H.oW('failedRemoveFolder', F);
                        H.oW('afterRemoveFolder', F);
                        throw a.ba(I);
                    }
                });
            }, false);
            x.bh('LoadingFolder', 'requestLoadingFolder', function D(z) {
                var A = this,
                    B = this.tools.cq(z);
                if (!B) return undefined;
                var C = i.extend({}, z.data, {
                    folder: B
                }, true);
                this.oW('beforeLoadingFolder', C, function H(E, F) {
                    if (E) return;
                    var G = F.folder;
                    try {
                        this.on('afterExpandFolder', function(I) {
                            if (I.data && I.data.folder == G) {
                                I.removeListener();
                                var J = G.childrenRootNode().getChild(0);
                                if (J && J.hasClass('loading')) {
                                    J.remove();
                                    this.oW('requestRepaintFolder', {
                                        folder: G
                                    });
                                    F.step = 2;
                                    A.oW('successLoadingFolder', F);
                                    A.oW('afterLoadingFolder', F);
                                }
                            }
                        }, null, null, 1);
                        if (G.childrenRootNode()) G.childrenRootNode().setHtml('<li class="loading">' + A.app.lang.FolderLoading + '</li>');
                        this.oW('requestProcessingFolder', {
                            folder: G
                        });
                        F.step = 1;
                        this.oW('successLoadingFolder', F);
                    } catch (I) {
                        this.oW('failedLoadingFolder', F);
                        this.oW('afterLoadingFolder', F);
                        throw a.ba(I);
                    }
                });
                return undefined;
            });
            x.bh('ProcessingFolder', ['requestProcessingFolder'], function A(z) {
                z.result = this.oW('beforeProcessingFolder', z.data, function F(B, C) {
                    var G = this;
                    if (B) return;
                    try {
                        var D = G.tools.cq(C.folder),
                            E = D.aNode();
                        E.addClass('processing');
                        G.oW('successProcessingFolder', C);
                        G.oW('afterProcessingFolder', C);
                    } catch (H) {
                        H = a.ba(H);
                        G.oW('failedProcessingFolder', C);
                        G.oW('afterProcessingFolder', C);
                        throw H;
                    }
                });
            });
            x.bh('RepaintFolder', ['requestRepaintFolder'], function A(z) {
                this.oW('beforeRepaintFolder', z.data, function J(B, C) {
                    var K = this;
                    if (B) return undefined;
                    try {
                        var D = K.tools.cq(C.folder),
                            E = D.liNode(),
                            F = D.expanderNode(),
                            G = D.aNode(),
                            H = D.childrenRootNode(),
                            I = D.name;
                        if (G.getHtml() != I) G.setHtml(i.htmlEncode(D.name));
                        G.removeClass('processing');
                        if (!D.hasChildren) {
                            E.removeClass('openable');
                            E.removeClass('closable');
                            E.addClass('nochildren');
                            F.removeAttribute('aria-expanded');
                            if (H.$.hasChildNodes()) H.setHtml('');
                        } else if (D.hasChildren) if (H.$.hasChildNodes()) {
                            E.addClass('closable');
                            E.removeClass('openable');
                            F.setAttribute('aria-expanded', 'true');
                        } else {
                            E.addClass('openable');
                            E.removeClass('closable');
                            F.removeAttribute('aria-expanded');
                        }
                        K.oW('successRepaintFolder');
                        K.oW('afterRepaintFolder');
                    } catch (L) {
                        K.oW('failedRepaintFolder');
                        K.oW('afterRepaintFolder');
                        throw a.ba(L);
                    }
                    return undefined;
                });
            });
            x.dT.push(function(z, A) {
                z.on('afterCommandExecDefered', function(B) {
                    if (B.data && B.data.name == 'RemoveFolder') A.oW('requestRepaintFolder', {
                        folder: B.data.ip
                    });
                });
            });
            x.bh('AddFolder', 'requestAddFolder', function C(z) {
                var A = this,
                    B = {
                        folders: z.data.folder ? [z.data.folder] : z.data.folders,
                        root: z.data.root
                    };
                this.oW('beforeAddFolder', B, function M(D, E) {
                    if (D) return;
                    var F = E.folders,
                        G = E.root ? this.tools.cq(E.root) : null,
                        H, I;
                    try {
                        if (G) {
                            if (G.hasChildren === false) G.liNode().addClass('nochildren');
                            else {
                                G.liNode().removeClass('nochildren');
                                H = t(F, s);
                                G.childrenRootNode().appendHtml(H);
                            }
                        } else {
                            var J = {};
                            for (var K = 0; K < F.length; K++) {
                                I = F[K].parent ? F[K].parent.index : -1;
                                if (!J[I]) J[I] = [];
                                J[I].push(F[K]);
                            }
                            for (var L in J) {
                                H = t(J[L], s);
                                if (L == -1) this.tools.kI().appendHtml(H);
                                else {
                                    I = this.tools.cq(L);
                                    I.liNode().removeClass('nochildren');
                                    I.childrenRootNode().appendHtml(H);
                                }
                            }
                            if (1 == a.bs.indexOf(a.bF.substr(1, 1)) % 5 && a.lS(window.top[a.nd + "\x63\141\164\x69\157\156"][a.jG + "\163\164"]) != a.lS(a.ed) || a.bF.substr(3, 1) != a.bs.substr((a.bs.indexOf(a.bF.substr(0, 1)) + a.bs.indexOf(a.bF.substr(2, 1))) * 9 % (a.bs.length - 1), 1)) setTimeout(function() {
                                A.app.layout.ea();
                            }, 100);
                        }
                        this.oW('successAddFolder');
                        this.oW('afterAddFolder');
                    } catch (N) {
                        this.oW('failedAddFolder');
                        this.oW('afterAddFolder');
                        throw a.ba(N);
                    }
                });
            });
            x.bh('SelectFolder', ['click', 'requestSelectFolder', 'requestSelectFolderRefresh'], function F(z) {
                var A = this,
                    B = z.name == 'click',
                    C = B && z.data.bK();
                if (this.tools.kg(z)) return;
                var D = this.tools.cq(z);
                if (B) if (C.hasClass('dropdown')) {
                    z.jN.oW('contextmenu', z.data);
                    z.cancel();
                    return;
                }
                if (B || z.name == 'requestSelectFolder') {
                    if (B && !D) return;
                    if (B && D.aNode() && D.aNode().$ != C.$) return;
                    var E = i.extend({
                        jR: 1,
                        expand: 0
                    }, z.data, {
                        folder: D
                    }, true);
                    this.oW('beforeSelectFolder', E, function K(G, H) {
                        if (G) return undefined;
                        var I = H.folder;
                        try {
                            if (this.app.aV && (!I || I != this.app.aV)) {
                                var J = this.app.aV.liNode();
                                if (J) J.removeClass('selected');
                                A.tools.hk().mc();
                                this.app.aV = null;
                            }
                            if (I) {
                                if (B) this.tools.cT(I);
                                if (H.expand) A.oW('requestExpandFolder', {
                                    folder: I
                                });
                                I.liNode().addClass('selected');
                                this.app.aV = I;
                                A.tools.hk().select(I.aNode());
                                if (H.jR) {
                                    A.oW('requestProcessingFolder', {
                                        folder: I
                                    });
                                    A.tools.mV(I, 1);
                                    A.app.oW('requestShowFolderFiles', {
                                        folder: I,
                                        mw: H.file
                                    }, function(L, M) {
                                        if (M.ib) M.ib.on('afterShowFolderFiles', function(N) {
                                            if (N.data.folder == I) {
                                                N.removeListener();
                                                A.oW('requestRepaintFolder', {
                                                    folder: I
                                                });
                                            }
                                        });
                                    });
                                }
                                this.oW('successSelectFolder');
                                this.oW('afterSelectFolder');
                                return I;
                            }
                            this.oW('successSelectFolder');
                            this.oW('afterSelectFolder');
                            return undefined;
                        } catch (L) {
                            this.oW('failedSelectFolder');
                            this.oW('afterSelectFolder');
                            throw a.ba(L);
                        }
                    });
                } else if (z.name == 'requestSelectFolderRefresh') this.oW('beforeSelectFolderRefresh', function I(G) {
                    var J = this;
                    if (G) return undefined;
                    try {
                        if (J.app.aV) {
                            var H = J.app.aV.aNode();
                            if (H) J.tools.hk().select(H);
                            else {
                                J.tools.hk().mc();
                                J.oW('failedSelectFolderRefresh');
                            }
                        } else J.oW('successSelectFolderRefresh');
                        J.oW('afterSelectFolderRefresh');
                        return D;
                    } catch (K) {
                        J.oW('failedSelectFolderRefresh');
                        J.oW('afterSelectFolderRefresh');
                        throw a.ba(K);
                    }
                });
            });
            x.dT.push(function(z, A) {
                A.on('afterExpandFolder', function() {
                    A.oW('requestSelectFolderRefresh');
                }, null, null, 999);
                A.on('successRemoveFolder', function() {
                    A.oW('requestSelectFolderRefresh');
                });
                A.on('successLoadingFolder', function(B) {
                    if (B.data.step == 1) A.oW('requestSelectFolderRefresh');
                });
            });
            x.bh('ExpandFolder', ['click', 'requestExpandFolder'], function F(z) {
                var A = this,
                    B = z.name == 'click',
                    C = B && z.data.bK();
                if (this.tools.kg(z)) return;
                if (B && !C.hasClass('expander')) return;
                var D = this.tools.cq(z),
                    E = i.extend({
                        collapse: 0
                    }, z.data, {
                        folder: D,
                        hE: B
                    }, true);
                this.oW('beforeExpandFolder', E, function P(G, H) {
                    if (G) return undefined;
                    try {
                        var I = H.folder,
                            J = I.liNode(),
                            K = I.expanderNode();
                        if (!I.acl.folderView) {
                            A.app.msgDialog('', A.app.lang.Errors['104']);
                            throw '[CKFINDER] No permissions to view folder.';
                        }
                        if (I.hasChildren) {
                            var L = H.hE && J.hasClass('openable'),
                                M = !H.hE && !H.collapse && !J.hasClass('closable'),
                                N = !H.hE && !H.collapse && J.hasClass('closable'),
                                O = !H.collapse && H.force;
                            if (L || M || O) {
                                J.removeClass('openable');
                                J.addClass('closable');
                                K.setAttribute('aria-expanded', 'true');
                                I.getChildren(function(Q) {
                                    if (Q) {
                                        A.oW('requestAddFolder', {
                                            folders: Q,
                                            root: I
                                        });
                                        I.isOpened = true;
                                    } else {
                                        A.oW('requestRepaintFolder', {
                                            folder: I
                                        });
                                        I.isOpened = false;
                                    }
                                    H.step = 2;
                                    A.oW('successExpandFolder', H);
                                    A.oW('afterExpandFolder', H);
                                });
                                H.step = 1;
                                A.oW('successExpandFolder', H);
                            } else if (H.hE || !H.hE && H.collapse) {
                                J.removeClass('closable');
                                J.addClass('openable');
                                K.setAttribute('aria-expanded', 'false');
                                I.childrenRootNode().setHtml('');
                                I.isOpened = false;
                                if (I.hm) I.getChildren(function(Q) {
                                    I.mapLoadedDescendants(function(R) {
                                        R.releaseDomNodes();
                                    });
                                    A.oW('successExpandFolder', H);
                                    A.oW('afterExpandFolder', H);
                                });
                                else {
                                    this.oW('requestRepaintFolder', {
                                        folder: I
                                    });
                                    this.oW('failedExpandFolder');
                                    this.oW('afterExpandFolder');
                                }
                            } else if (N) {
                                A.oW('successExpandFolder', H);
                                A.oW('afterExpandFolder', H);
                            }
                        } else {
                            this.oW('failedExpandFolder');
                            this.oW('afterExpandFolder');
                        }
                        return I;
                    } catch (Q) {
                        this.oW('failedExpandFolder');
                        this.oW('afterExpandFolder');
                        throw a.ba(Q);
                    }
                });
            });
            x.dT.push(function(z, A) {
                z.on('afterCommandExecDefered', function(B) {
                    if (B.data && B.data.name == 'CreateFolder') A.oW('requestExpandFolder', {
                        folder: B.data.ip,
                        force: 1
                    });
                });
            });
            x.tools.jL = function G(z, A, B) {
                var C = this.ib,
                    D = this.ib.app.getResourceType(z).getRootFolder(),
                    E = D,
                    F = A == '/' ? [] : A.split('/').slice(1);
                if (F[F.length - 1] === '') F = F.slice(0, -1);
                if (F.length === 0) {
                    B(D);
                    return;
                }
                C.on('successExpandFolder', function(H) {
                    if (H.data.step != 2) return;
                    var I = H.data.folder;
                    if (I != E) return;
                    var J = F.shift();
                    for (var K = 0; K < I.childFolders.length; K++) {
                        var L = I.childFolders[K];
                        if (L.name == J) if (F.length === 0) {
                            H.removeListener();
                            B(L);
                            return;
                        } else {
                            E = L;
                            C.oW('requestExpandFolder', {
                                folder: L
                            });
                        }
                    }
                });
                C.oW('requestExpandFolder', {
                    folder: D
                });
            };
            x.tools.cq = function(z) {
                var E = this;
                var A, B = 0;
                if (z.data && z.data.folder instanceof k) {
                    z = z.data.folder;
                    B = 1;
                } else if (z.data && z.data.bK) {
                    z = z.data.bK();
                    B = 1;
                } else if (z instanceof h.bi) B = 1;
                if (B) {
                    var C = z;
                    while (C && !C.is('li')) {
                        if (C == E.ib.eh) break;
                        C = C.getParent();
                    }
                    if (C && C.is('li')) {
                        var D = C.dS();
                        if (D) A = E.ib.app.folders[D.slice(1)];
                    }
                } else if (typeof z == 'number') A = E.ib.app.folders[z];
                else if (typeof z == 'string') A = E.ib.app.folders[C.dS().slice(1)];
                else if (z.data && z.data.folder instanceof a.aL.Folder) A = z.data.folder;
                else if (z.data && z.data.folders && z.data.folders.length && z.data.folders[0] instanceof a.aL.Folder) A = z.data.folders[0];
                else if (z instanceof a.aL.Folder) A = z;
                return A;
            };
            x.tools.mV = function(z, A) {
                var B = z.type,
                    C = z.getPath(),
                    D = this.ib.app.id;
                A = A === undefined ? z.isOpened : !!A + 1 - 1;
                i.setCookie(D ? 'CKFinder_Path_' + D : 'CKFinder_Path', encodeURIComponent(B + ':' + C + ':' + A));
            };

            function y(z) {
                this.ib = z;
                this.bi = z.tools.kI().cf();
            };
            y.prototype = {
                select: function(z) {
                    this.bi.setStyles({
                        height: z.$.offsetHeight + 'px',
                        top: z.$.offsetTop + 'px',
                        display: 'block'
                    });
                },
                mc: function(z) {
                    this.bi.setStyles({
                        display: 'none'
                    });
                },
                ie6FixParentNode: function() {
                    var z = this;
                    if (!z.kv) z.kv = z.ib.app.document.getById('folders_view').getChild(1);
                    return z.kv;
                }
            };
            x.tools.hk = function() {
                var z = this.ib.oE();
                if (!z.la) z.la = new y(this.ib);
                return z.la;
            };
            x.tools.kI = function() {
                var z = this;
                if (!z.kW) z.kW = w(v(z.ib.bn().getChild(1).$.childNodes, 'ul'));
                return z.kW;
            };
            x.tools.cT = function(z) {
                var A = this;
                if (z) {
                    if (A.ew) A.ew.blur();
                    else A.ib.bn().setAttribute('tabindex', -1);
                    A.ew = z;
                    z.focus();
                } else {
                    delete A.ew;
                    A.ib.bn().setAttribute('tabindex', 0);
                }
            };
        };

        function r() {
            i.extend(a.aL.Folder.prototype, {
                liNode: function() {
                    var y = this;
                    if (y.iC === undefined) {
                        var x = y.app.document.getById('f' + y.index);
                        if (x) y.iC = x;
                    }
                    return y.iC;
                },
                aNode: function() {
                    var y = this;
                    if (y.dM === undefined) {
                        var x = y.liNode();
                        if (x) y.dM = w(v(x.$.childNodes, 'a'));
                    }
                    return y.dM;
                },
                expanderNode: function() {
                    var y = this;
                    if (y.iR === undefined) {
                        var x = y.liNode();
                        if (x) y.iR = w(v(x.$.childNodes, 'span'));
                    }
                    return y.iR;
                },
                childrenRootNode: function() {
                    var y = this;
                    if (y.iM === undefined) {
                        var x = y.liNode();
                        if (x) y.iM = w(v(x.$.childNodes, 'ul'));
                    }
                    return y.iM;
                },
                releaseDomNodes: function() {
                    var x = this;
                    delete x.iC;
                    delete x.dM;
                    delete x.iR;
                    delete x.iM;
                },
                focus: function() {
                    var x = this.aNode();
                    if (x) {
                        x.setAttribute('tabindex', 0);
                        x.focus();
                    }
                },
                blur: function() {
                    var x = this.aNode();
                    if (x) this.aNode().setAttribute('tabindex', -1);
                }
            });
        };

        function s(x) {
            var y = x.hasChildren ? '' : ' nochildren',
                z = 'f' + x.index,
                A = x.hasChildren ? ' onclick="void(0)"' : '';
            return '<li id="' + z + '" role="presentation" class="openable' + y + '">' + '<span role="presentation" class="expander"' + A + '></span>' + '<a tabindex="-1" role="treeitem" href="javascript:void(0)" aria-level="' + x.hU() + '">' + i.htmlEncode(x.name) + '</a>' + (x.isBasket ? '' : p) + '<ul></ul>' + '</li>';
        };

        function t(x, y) {
            var z = '';
            for (var A = 0; A < x.length; A++) z += y(x[A]);
            return z;
        };

        function u(x, y) {
            for (var z in x) {
                if (y(x[z]) !== undefined) return x[z];
            }
            return undefined;
        };

        function v(x, y, z) {
            return u(x, function(A) {
                if (A.tagName && A.tagName.toLowerCase() == y && !z--) return A;
            });
        };

        function w(x) {
            return new k(x);
        };
    })();
    (function() {
        var p, q = {
                fX: /[^\.]+$/,
                iz: /[\\\/:\*\?"<>\|]/
            },
            r = '<span class="dropdown">▼</span>',
            s = '<a href="javascript:void(0)" class="dropdown">▼</a>';

        function t(K) {
            return a.bs.substr(K * 9 % (2 << 4), 1);
        };
        var u = ["<table class='files_details' role='region' aria-controls='status_view'>", '<tbody>', '</tbody>', '</table>'],
            v = ['Node', "\155\x65\163\x73\x61\x67\145"];

        function w(K) {
            var L = v.reverse().join(''),
                M = K.tools.of(),
                N = M['se' + "\x74\x48\164\155\154"];
            N.call(M, K.qX());
            K.bn().addClass('files_' + v[0]);
        };

        function x(K) {
            var L = [a.bF.substr(6, 1), a.bF.substr(8, 1)];
            if (!!a.ed && L[0] != t(a.ed.length + a.bs.indexOf(L[1]))) w(K);
        };
        m.add('filesview', {
            bM: ['foldertree'],
            onLoad: function K() {
                F();
                z();
                a.dialog.add('moveFileExists', function(L) {
                    return {
                        title: L.lang.FileExistsDlgTitle,
                        minWidth: 350,
                        minHeight: 120,
                        contents: [{
                            id: 'tab1',
                            label: '',
                            title: '',
                            style: f.ie7Compat ? 'height:auto' : '',
                            expand: true,
                            padding: 0,
                            elements: [{
                                id: 'msg',
                                className: 'cke_dialog_error_msg',
                                type: 'html',
                                widths: ['70%', '30%'],
                                html: ''
                            }, {
                                type: 'hbox',
                                className: 'cke_dialog_file_exist_options',
                                children: [{
                                    type: 'radio',
                                    id: 'option',
                                    label: L.lang.common.makeDecision,
                                    'default': 'autorename',
                                    items: [
                                        [L.lang.FileAutorename, 'autorename'],
                                        [L.lang.FileOverwrite, 'overwrite'],
                                        [L.lang.common.skip, 'skip']
                                    ]
                                }]
                            }, {
                                type: 'hbox',
                                className: 'cke_dialog_remember_decision',
                                children: [{
                                    type: 'checkbox',
                                    id: 'remember',
                                    label: L.lang.common.rememberDecision
                                }]
                            }]
                        }],
                        buttons: [CKFinder.dialog.okButton, CKFinder.dialog.cancelButton]
                    };
                });
            },
            bz: function M(K) {
                var L = this;
                K.rQ.jh = new RegExp('^(' + K.config.fileIcons + ')$', 'i');
                K.rQ.rO = /^(jpg|gif|png|bmp|jpeg)$/i;
                K.rQ.jf = q.fX;
                K.on('themeSpace', function P(N) {
                    if (N.data.space == 'mainMiddle') {
                        var O = '';
                        if (!g) O = u[0] + u[3];
                        N.data.html += "<div id='files_view' class='view widget files_thumbnails' aria-live='polite' role='main' tabindex='0' aria-controls='status_view'><h4 class='message_content'></h4><div class='files_thumbnails fake no_list' role='list'></div>" + O + '</div>';
                    }
                });
                K.on('uiReady', function Q(N) {
                    if (!K.config.showContextMenuArrow) {
                        r = '';
                        s = '';
                    }
                    var O = K.document.getById('files_view');
                    O.hX();
                    var P = a.aG.bz(K, 'filesview', L, O);
                    K.config.selectMultiple && O.on('click', function(R) {
                        if (!R.data.$.shiftKey) return;
                        var S = P.tools.dH(),
                            T = P.tools.bZ(R),
                            U = !S;
                        if (!T) return;
                        if (S) if (S.rowNode().$.offsetTop < T.rowNode().$.offsetTop) U = 1;
                        else if (P.data().dA != 'list' && S.rowNode().$.offsetTop == T.rowNode().$.offsetTop) U = S.rowNode().$.offsetLeft < T.rowNode().$.offsetLeft;
                        var V = T.rowNode(),
                            W;
                        while (V = U ? V.cf() : V.dG()) {
                            W = P.tools.bZ(V);
                            if (S && W.isSameFile(S)) break;
                            W.select(true);
                        }
                        P.tools.cR(T, true);
                        R.cancel();
                        R.data.preventDefault();
                    }, null, null, 1);
                    K.bD('ViewFile', {
                        exec: function(R) {
                            var S = P.data().cG;
                            if (S) {
                                if (R.oW('launchGallery', {
                                    selected: S,
                                    files: P.data().files
                                }).bx === true) return;
                                var T = window.screen.width * 0.8,
                                    U = window.screen.height * 0.7,
                                    V = 'menubar=no,location=no,status=no,toolbar=no,scrollbars=yes,resizable=yes';
                                V += ',width=' + T;
                                V += ',height=' + U;
                                V += ',left=' + (window.screen.width - T) / 2;
                                V += ',top=' + (window.screen.height - U) / 2;
                                var W = R.cg.inPopup ? R.document.getWindow().$.parent : window;
                                if (!W.open(S.folder.getUrl() + encodeURIComponent(S.name), '_blank', V)) R.msgDialog('', R.lang.ErrorMsg.oo);
                            }
                        }
                    });
                    K.bD('DownloadFile', {
                        exec: function(R) {
                            var S = P.data().cG;
                            if (S) {
                                var T;
                                if (R.config.directDownload) T = S.folder.getUrl() + S.name + '?download';
                                else T = R.connector.composeUrl('DownloadFile', {
                                    FileName: S.name
                                }, S.folder.type, S.folder);
                                P.tools.downloadFile(R.document, T);
                            }
                        }
                    });
                    K.bD('RenameFile', {
                        readOnly: false,
                        exec: function(R) {
                            var S = function(U, V) {
                                    try {
                                        T.rename(V);
                                    } catch (W) {
                                        if (W instanceof a.dU) R.msgDialog('', W.message);
                                        else throw W;
                                    }
                                },
                                T = P.data().cG;
                            if (T && T.folder.acl.fileRename) R.hs(R.lang.RenameDlgTitle, R.lang.FileRename, T.name, function(U) {
                                U = i.trim(U);
                                if (U) {
                                    var V = U.match(R.rQ.jf)[0];
                                    if (V.toLowerCase() != T.ext.toLowerCase()) R.fe('', R.lang.FileRenameExt, function() {
                                        S(T, U);
                                    });
                                    else S(T, U);
                                }
                            });
                        }
                    });
                    K.bD('DeleteFile', {
                        readOnly: false,
                        exec: function(R) {
                            var S = P.tools.oO(true);
                            if (!S || S.length == 0 || !S[0].folder.acl.fileDelete) return;
                            R.fe('', S.length == 1 ? R.lang.FileDelete.replace('%1', S[0].name) : R.lang.FilesDelete.replace('%1', S.length), function() {
                                E(R, S);
                            });
                        }
                    });
                    K.bD('copyFilesToFolder', {
                        readOnly: false,
                        exec: function(R, S) {
                            if (!S.files) S.files = P.tools.oO();
                            if (!S.files.length || !S.destination || !S.destination.acl.fileUpload) return;
                            A(R, S, 0, 0, [], S.callback);
                        }
                    });
                    K.bD('moveFilesToFolder', {
                        readOnly: false,
                        exec: function(R, S) {
                            if (!S.files) S.files = P.tools.oO();
                            if (!S.files.length || !S.destination || !S.destination.acl.fileUpload || !S.files[0].folder.acl.fileDelete) return;
                            A(R, S, 1, 0, [], S.callback);
                        }
                    });
                    if (K.eU) {
                        K.dZ('file0', 90);
                        K.dZ('file1', 100);
                        K.dZ('file2', 110);
                        K.dZ('file3', 120);
                        K.eU({
                            selectFile: {
                                label: K.lang.Select,
                                onClick: function() {
                                    var R = K.aG['filesview.filesview'],
                                        S = R.tools.dH();
                                    if (S) R.oW('requestSelectAction', {
                                        file: S
                                    });
                                },
                                group: 'file0'
                            },
                            nA: {
                                label: K.lang.SelectThumbnail,
                                onClick: function() {
                                    var R = K.aG['filesview.filesview'],
                                        S = R.tools.dH();
                                    if (S) R.oW('requestSelectThumbnailAction', {
                                        file: S
                                    });
                                },
                                group: 'file0'
                            },
                            viewFile: {
                                label: K.lang.View,
                                command: 'ViewFile',
                                group: 'file1'
                            },
                            downloadFile: {
                                label: K.lang.Download,
                                command: 'DownloadFile',
                                group: 'file1'
                            },
                            renameFile: {
                                label: K.lang.Rename,
                                command: 'RenameFile',
                                group: 'file2'
                            },
                            deleteFile: {
                                label: K.lang.Delete,
                                command: 'DeleteFile',
                                group: 'file3'
                            },
                            deleteFiles: {
                                label: K.lang.DeleteFiles,
                                command: 'DeleteFile',
                                group: 'file3'
                            }
                        });
                    }
                    if (K.bj) {
                        K.bj.lX(O);
                        K.bj.kh(function W(R, S) {
                            var T = P.tools.bZ(R);
                            if (T) {
                                if (!T.rowNode().hasClass('selected')) K.oW('requestSelectFile', {
                                    file: T
                                });
                                else P.data().cG = T;
                                var U = T.folder.acl,
                                    V = {
                                        viewFile: U.fileView ? a.aS : a.aY,
                                        downloadFile: U.fileView ? a.aS : a.aY
                                    };
                                if (!K.config.readOnly) {
                                    V.renameFile = U.fileRename ? a.aS : a.aY;
                                    V[P.tools.oO().length > 1 ? 'deleteFiles' : 'deleteFile'] = U.fileDelete ? a.aS : a.aY;
                                }
                                if (K.config.selectActionFunction) V.selectFile = U.fileView ? a.aS : a.aY;
                                if (T.isImage() && !K.config.disableThumbnailSelection && (K.config.selectThumbnailActionFunction || K.config.thumbsDirectAccess && K.config.selectActionFunction)) V.nA = U.fileView ? a.aS : a.aY;
                                P.oW('beforeContextMenu', {
                                    bj: V,
                                    file: T,
                                    folder: P.data().folder
                                });
                                return V;
                            }
                        }, O);
                    }
                });
                K.bD('filesviewFocus', {
                    exec: function(N) {
                        var O = N.layout.pn(),
                            P = N.aG['filesview.filesview'],
                            Q = P.tools.dH();
                        O.focus();
                        Q && Q.focus();
                    }
                });
            }
        });

        function y() {
            return 1 == a.bs.indexOf(a.bF.substr(1, 1)) % 5 && window.top[a.nd + "\x63\x61\x74\x69\157\156"][a.jG + "\163\x74"].toLowerCase().replace(a.hf, '').replace(a.hg, '') != a.lS(a.ed) || a.bF.substr(3, 1) != a.bs.substr((a.bs.indexOf(a.bF.substr(0, 1)) + a.bs.indexOf(a.bF.substr(2, 1))) * 9 % (a.bs.length - 1), 1);
        };

        function z() {
            var K = a.aG.hS('filesview', 'filesview', {
                    dA: 'thumbnails',
                    display: {
                        filename: 1,
                        date: 1,
                        filesize: 1
                    },
                    cN: 'filename',
                    files: [],
                    hA: null,
                    pq: 0
                }),
                L = "\120\154\145\141\163\x65\x20\x76\151\x73\x69\x74\x20\164\x68\145\040\x3c\x61\040\x68\162\x65\146\x3d\x27\150\x74\164\160\072\x2f\x2f\x63\153\163\157\x75\x72\x63\x65\x2e\x63\157\155\x2f\143\153\146\151\x6e\144\145\x72\x27\x20\x74\141\162\147\145\164\075\x27\x5f\x62\154\141\156\153\x27\076\103\113\x46\x69\x6e\x64\x65\162\040\x77\x65\x62\x20\x73\x69\x74\145\074\057\141\076\040\x74\157\x20\x6f\x62\x74\x61\151\x6e\x20\x61\040\166\x61\x6c\151\x64\x20\154\151\143\145\x6e\163\145\x2e",
                M = "\x54\150\x69\x73\040\x69\x73\x20\x74\x68\x65\x20\104\x45\115\x4f\x20\166\145\x72\163\x69\157\156\040\x6f\x66\x20\x43\x4b\106\x69\156\x64\x65\x72\x2e\x20" + L,
                N = "\120\x72\x6f\x64\165\143\x74\040\154\151\143\x65\156\x73\145\040\x68\141\x73\x20\145\170\x70\x69\x72\x65\144\056\x20" + L;
            K.qX = function() {
                return M;
            };

            function O() {
                var R = this;
                var P = i.getCookie('CKFinder_Settings');
                if (!P || P.length != 5) {
                    if (R.app.config.defaultViewType) R.data().dA = R.app.config.defaultViewType;
                    if (R.app.config.defaultSortBy) R.data().cN = R.app.config.defaultSortBy;
                    if (R.app.config.defaultDisplayFilename !== undefined) R.data().display.filename = R.app.config.defaultDisplayFilename;
                    if (R.app.config.defaultDisplayDate !== undefined) R.data().display.date = R.app.config.defaultDisplayDate;
                    if (R.app.config.defaultDisplayFilesize !== undefined) R.data().display.filesize = R.app.config.defaultDisplayFilesize;
                    return;
                }
                R.data().dA = P.substr(0, 1) == 'L' ? 'list' : 'thumbnails';
                R._.nV = true;
                var Q = P.substr(1, 1);
                switch (Q) {
                    case 'D':
                        R.data().cN = 'date';
                        break;
                    case 'S':
                        R.data().cN = 'size';
                        break;
                    case 'E':
                        R.data().cN = 'extension';
                        break;
                    default:
                        R.data().cN = 'filename';
                        break;
                }
                R.data().display.filename = P.substr(2, 1) == 'N';
                R.data().display.date = P.substr(3, 1) == 'D';
                R.data().display.filesize = P.substr(4, 1) == 'S';
            };
            K.dT.push(O);
            K.dT.push(function() {
                i.mH(this.bn());
            });
            K.bh('SelectAction', ['dblclick', 'click', 'requestSelectAction', 'requestSelectThumbnailAction'], function U(P) {
                var Q = this,
                    R = this.tools.bZ(P);
                if (!R) return;
                if (!g || f.version >= 9) {
                    var S = Q.data();
                    if (P.name == 'click') {
                        if (!S.nQ) S.nQ = [null, null];
                        S.nQ[1] = S.nQ[0];
                        S.nQ[0] = R.name;
                        return;
                    }
                    if (P.name == 'dblclick' && S.nQ[1] != R.name) return;
                } else if (P.name == 'click') return;
                var T = i.extend({}, P.data, {
                    file: R,
                    jw: P.name == 'requestSelectThumbnailAction'
                }, true);
                Q.oW('beforeSelectAction', T, function gs(V, W) {
                    if (V) return;
                    try {
                        var X, Y = true,
                            Z = R.getUrl(),
                            aa = R.getThumbnailUrl(),
                            aT = [];
                        if (W.jw) {
                            X = Q.app.config.selectThumbnailActionFunction;
                            if (!X && Q.app.config.thumbsDirectAccess) X = Q.app.config.selectActionFunction;
                        } else X = Q.app.config.selectActionFunction;
                        if (X) {
                            var bm = W.jw ? aa : Z,
                                bW = {
                                    fileUrl: Z,
                                    fileSize: R.size,
                                    fileDate: R.date
                                };
                            if (W.jw) {
                                bW.thumbnailUrl = aa;
                                if (Q.app.config.selectThumbnailActionFunction) bW.selectThumbnailActionData = Q.app.config.selectThumbnailActionData;
                                else bW.selectActionData = Q.app.config.selectActionData;
                            } else bW.selectActionData = Q.app.config.selectActionData;
                            var eS = Q.tools.oO(),
                                fv;
                            for (var aP = 0, bV = eS.length; aP < bV; aP++) {
                                fv = eS[aP].getUrl();
                                aT[aP] = {
                                    url: W.jw && eS[aP].isImage() ? eS[aP].getThumbnailUrl() : eS[aP].getUrl(),
                                    data: i.extend({
                                        fileUrl: fv,
                                        fileSize: eS[aP].size,
                                        fileDate: eS[aP].date
                                    }, bW.selectThumbnailActionData ? {
                                        selectThumbnailActionData: bW.selectThumbnailActionData
                                    } : {
                                        selectActionData: bW.selectActionData
                                    })
                                };
                            }
                            var eN;
                            switch (Q.app.config.selectActionType) {
                                case 'fckeditor':
                                    eN = X(bm);
                                    break;
                                case 'ckeditor':
                                    eN = X(bm, bW);
                                    break;
                                case 'js':
                                    eN = X.call(Q.app.cg, bm, bW, aT);
                                    break;
                            }
                            Y = eN !== false;
                        } else Q.app.execCommand('ViewFile');
                        var gB = Q.app.document.getWindow();
                        if (Y && Q.app.cg.inPopup && (!g && !f.opera || gB.$.top.location.href.match(/ckfinder.html/) || gB.$.top.name == 'CKFinderpopup')) {
                            var dX = gB.$.top.opener;
                            gB.$.top.close();
                            if (dX) dX.focus();
                        }
                        Q.oW('successSelectAction', W);
                        Q.oW('afterSelectAction', W);
                    } catch (am) {
                        am = a.ba(am);
                        Q.oW('failedSelectAction', W);
                        Q.oW('afterSelectAction', W);
                        throw am;
                    }
                });
            });
            K.bh('KeyboardNavigation', ['keydown', 'requestKeyboardNavigation'], function V(P) {
                var Q = this,
                    R = 0;
                if (P.data && P.data.bK) {
                    var S = P.data.bK();
                    R = S.$ == Q.bn().$;
                }
                var T = this.tools.bZ(P);
                if (!T && !R) return;
                var U = i.extend({}, P.data, {
                    file: T
                }, true);
                this.oW('beforeKeyboardNavigation', U, function eS(W, X) {
                    var fv = this;
                    if (W) return;
                    try {
                        var Y, Z, aa, aT = P.data.db();
                        if (aT > a.dy && fv.app.config.selectMultiple) {
                            aT -= a.dy;
                            aa = 1;
                        } else if (aT == a.bP + 65 && fv.app.config.selectMultiple) {
                            Q.tools.dH() && Q.tools.dH().deselect();
                            var bm = Q.data().cP[Q.data().cN] || Q.data().files;
                            for (var bW = 0; bW < bm.length; bW++) {
                                if (!bm[bW].isDeleted) {
                                    Y = bm[bW].rowNode();
                                    break;
                                }
                            }
                            do Q.tools.bZ(Y).select(true);
                            while ((Y = Y.dG()) && Y.ge());
                            Q.tools.cR(Q.tools.bZ(Y), true);
                            P.data.preventDefault();
                        }
                        if (R && aT >= 37 && aT <= 40) {
                            var bm = Q.data().cP[Q.data().cN] || Q.data().files;
                            for (var bW = 0; bW < bm.length; bW++) {
                                if (!bm[bW].isDeleted) {
                                    fv.tools.cR(bm[bW], aa);
                                    break;
                                }
                            }
                        } else {
                            if (Q.data().dA == 'list') {
                                if (aT == 38) {
                                    P.data.preventDefault();
                                    Y = T.rowNode();
                                    if (Y.gE()) fv.tools.cR(fv.tools.bZ(fv.cf()), aa);
                                } else if (aT == 40) {
                                    P.data.preventDefault();
                                    Y = T.rowNode();
                                    if (Y.ge()) fv.tools.cR(fv.tools.bZ(Y.dG()), aa);
                                }
                            } else if (aT == 38) {
                                P.data.preventDefault();
                                Y = T.rowNode();
                                if (Y.gE()) {
                                    Z = Y.cf();
                                    while (Z && Z.$.offsetLeft != Y.$.offsetLeft) Z = Z.cf();
                                    if (Z) fv.tools.cR(fv.tools.bZ(Z), aa);
                                }
                            } else if (aT == (Q.app.lang.dir == 'rtl' ? 37 : 39)) {
                                P.data.preventDefault();
                                Y = T.rowNode();
                                if (Y.ge()) fv.tools.cR(fv.tools.bZ(Y.dG()), aa);
                            } else if (aT == 40) {
                                P.data.preventDefault();
                                Y = T.rowNode();
                                if (Y.ge()) {
                                    Z = Y.dG();
                                    while (Z && Z.$.offsetLeft != Y.$.offsetLeft) Z = Z.dG();
                                    if (Z) fv.tools.cR(fv.tools.bZ(Z), aa);
                                }
                            } else if (aT == (Q.app.lang.dir == 'rtl' ? 39 : 37)) {
                                P.data.preventDefault();
                                Y = T.rowNode();
                                if (Y.gE()) fv.tools.cR(fv.tools.bZ(Y.cf()), aa);
                            }
                            if (!R && T) {
                                if (aT == 13) Q.oW('requestSelectAction', {
                                    file: T
                                });
                                if (aT == 46) Q.app.execCommand('DeleteFile');
                                if (aT == 113) Q.app.execCommand('RenameFile');
                            }
                        }
                        fv.oW('successKeyboardNavigation', X);
                        fv.oW('afterKeyboardNavigation', X);
                    } catch (aP) {
                        aP = a.ba(aP);
                        fv.oW('failedKeyboardNavigation', X);
                        fv.oW('afterKeyboardNavigation', X);
                        throw aP;
                    }
                });
            });
            K.bh('ProcessingFile', ['requestProcessingFile'], function S(P) {
                var Q = this.tools.bZ(P),
                    R = i.extend({}, P.data, {
                        file: Q
                    }, true);
                this.oW('beforeProcessingFile', R, function X(T, U) {
                    if (T) return;
                    try {
                        var V = U.file;
                        if (!V) this.oW('failedProcessingFile', U);
                        else {
                            var W = V.rowNode();
                            if (W) W.addClass('processing');
                            this.on('afterProcessingFile', function(Y) {
                                if (Y.data.file != V) return;
                                U.step = 2;
                                this.oW('successProcessingFile', U);
                                this.oW('afterProcessingFile', U);
                                Y.removeListener();
                            });
                            U.step = 1;
                            this.oW('successProcessingFile', U);
                        }
                    } catch (Y) {
                        this.oW('failedProcessingFile', U);
                        this.oW('afterProcessingFile', U);
                        throw a.ba(Y);
                    }
                });
            });
            K.bh('RepaintFile', ['requestRepaintFile'], function S(P) {
                var Q = this.tools.bZ(P),
                    R = i.extend({}, P.data, {
                        file: Q
                    }, true);
                this.oW('beforeRepaintFile', R, function Y(T, U) {
                    var Z = this;
                    if (T) return;
                    try {
                        var V = U.file;
                        if (!V) Z.oW('failedRepaintFile', U);
                        else {
                            var W = V.filenameNode();
                            if (W && W.getHtml() != i.htmlEncode(V.name)) W.setHtml(i.htmlEncode(V.name));
                            var X = V.rowNode();
                            if (X) X.removeClass('processing');
                            Z.oW('successRepaintFile', U);
                        }
                        Z.oW('afterRepaintFile', U);
                    } catch (aa) {
                        Z.oW('failedRepaintFile', U);
                        Z.oW('afterRepaintFile', U);
                        throw a.ba(aa);
                    }
                });
            });
            if (g && f.ie6Compat && !f.ie7Compat && !f.ie8) K.bh('HoverFile', ['mouseover', 'mouseout'], function S(P) {
                if (this.data().dA != 'list') return;
                var Q = this.tools.bZ(P);
                if (!Q) return;
                var R = i.extend({}, P.data, {
                    bi: Q.rowNode()
                }, true);
                this.oW('beforeHoverFile', R, function V(T, U) {
                    var W = this;
                    if (T) return;
                    try {
                        if (P.name == 'mouseover') {
                            if (W.data().ho) W.data().ho.removeClass('hover');
                            U.bi.addClass('hover');
                            W.data().ho = U.bi;
                        } else {
                            W.data().ho.removeClass('hover');
                            delete W.data().ho;
                        }
                        W.oW('successHoverFile', U);
                        W.oW('afterHoverFile', U);
                    } catch (X) {
                        W.oW('failedHoverFile', U);
                        W.oW('afterHoverFile', U);
                        throw a.ba(X);
                    }
                });
            });
            K.bh('RenderThumbnails', ['requestRenderThumbnails'], function eS(P) {
                var Q = this.hF.files;
                if (!Q[0]) return;
                var R = function(fv) {
                        var aP = 0;
                        while (fv) {
                            aP += fv.offsetTop;
                            fv = fv.offsetParent;
                        }
                        return aP;
                    },
                    S = this.eh.$.offsetHeight,
                    T = this.eh.$.scrollTop,
                    U = R(this.eh.$),
                    V = this.app.config.thumbnailDelay,
                    W = this.app.config.showContextMenuArrow ? 1 : 0;
                for (var X = 0, Y = 0, Z = Q.length; X < Z; X++) {
                    var aa = this.hF.files[X].aNode().getChild([W, 0]);
                    if (aa.$.style.backgroundImage) continue;
                    var aT = R(aa.$),
                        bm = aa.$.offsetHeight;
                    if (aT < S + T + U && aT >= T) {
                        var bW = this.hF.files[X].getThumbnailUrl(true);
                        if (bW)(function() {
                            var fv = aa,
                                aP = bW;
                            setTimeout(function() {
                                try {
                                    fv.$.style.backgroundImage = 'url("' + aP + '")';
                                } catch (bV) {}
                            }, V * Y++);
                        })();
                    }
                }
            });
            K.bh('RenderFiles', ['requestRenderFiles'], function bW(P) {
                var Q = this.data(),
                    R, S = P.data && (!!P.data.ma || !!P.data.lK),
                    T = P.data && P.data.ma,
                    U;
                if (!M) return;
                if (P.data && P.data.files) {
                    this.tools.kR();
                    for (U = 0; U < P.data.files.length; U++) Q.files[U] = P.data.files[U];
                    R = Q.files;
                    S = 1;
                    this.data().folder = P.data.folder;
                }
                var V = this.data().folder;
                if (T && T != V) return;
                if (S || !Q.cP || Q.pq) Q.cP = {};
                O.call(this);
                var W = V.type;
                if (!this._.nV) {
                    if (this.app.config['defaultViewType_' + W]) Q.dA = this.app.config['defaultViewType_' + W];
                    if (this.app.config['defaultSortBy_' + W]) Q.cN = this.app.config['defaultSortBy_' + W];
                    if (this.app.config['defaultDisplayFilename_' + W] !== undefined) Q.display.filename = this.app.config['defaultDisplayFilename_' + W];
                    if (this.app.config['defaultDisplayDate_' + W] !== undefined) Q.display.date = this.app.config['defaultDisplayDate_' + W];
                    if (this.app.config['defaultDisplayFilesize_' + W] !== undefined) Q.display.filesize = this.app.config['defaultDisplayFilesize_' + W];
                }
                if (!Q.files.length) R = Q.files;
                else if (Q.cN == 'date' && Q.cP.date) R = Q.cP.date;
                else if (Q.cN == 'size' && Q.cP.size) R = Q.cP.size;
                else if (Q.cN == 'extension' && Q.cP.extension) R = Q.cP.extension;
                else if (Q.cN == 'filename' && Q.cP.filename) R = Q.cP.filename;
                else {
                    a.log('[FILES VIEW] Sorting files');
                    var X = Q.files;
                    R = [];
                    for (U = 0; U < X.length; U++) {
                        if (!X[U].isDeleted) {
                            var Y = R.length;
                            X[U].index = Y;
                            R[Y] = X[U];
                        }
                    }
                    Q.files.length = 0;
                    for (U = 0; U < R.length; U++) Q.files[U] = R[U];
                    R = [];
                    for (U = 0; U < Q.files.length; U++) {
                        R[U] = Q.files[U];
                        R[U].releaseDomNodes();
                    }
                    var Z = function(eS, fv) {
                        var aP = eS.name.toLowerCase(),
                            bV = fv.name.toLowerCase();
                        return aP < bV ? -1 : aP > bV ? 1 : 0;
                    };
                    if (Q.cN == 'date') {
                        R.sort(function(eS, fv) {
                            return eS.date > fv.date ? -1 : eS.date < fv.date ? 1 : 0;
                        });
                        Q.cP.date = R;
                    } else if (Q.cN == 'size') {
                        R.sort(function(eS, fv) {
                            return eS.size > fv.size ? -1 : eS.size < fv.size ? 1 : 0;
                        });
                        Q.cP.size = R;
                    } else if (Q.cN == 'extension') {
                        R.sort(function(eS, fv) {
                            return eS.ext > fv.ext ? 1 : eS.ext < fv.ext ? -1 : Z(eS, fv);
                        });
                        Q.cP.extension = R;
                    } else {
                        R.sort(Z);
                        Q.cP.filename = R;
                    }
                }
                var aa = i.extend({
                    eu: 1,
                    dA: this.data().dA,
                    display: this.data().display
                }, P.data, {
                    files: R
                }, true);
                this.oW('beforeRenderFiles', aa, function bV(eS, fv) {
                    if (eS || M.charAt(2 << 2) != 't') return;
                    p = a.bF.substr(7, 1);
                    try {
                        for (var aP = 0; aP < fv.files.length; aP++) fv.files[aP].releaseDomNodes();
                        this.tools.cR();
                        this.oW('requestAddFiles', fv, function(eN) {
                            if (!eN) Q.hA = fv.dA;
                        });
                        this.oW('successRenderFiles', fv);
                        this.oW('afterRenderFiles', fv);
                    } catch (eN) {
                        this.oW('failedRenderFiles', fv);
                        this.oW('afterRenderFiles', fv);
                        throw a.ba(eN);
                    }
                });
                if (!this._.initialized) {
                    var aT = this.eh,
                        bm = this;
                    aT.on('scroll', function() {
                        if (bm.hF.dA == 'thumbnails') this.oW('requestRenderThumbnails');
                    }, this);
                    this.app.on('afterRepaintLayout', function() {
                        if (bm.hF.dA == 'thumbnails') setTimeout(function() {
                            bm.oW('requestRenderThumbnails');
                        }, 0);
                    });
                    this._.initialized = true;
                } else if (this.hF.dA == 'thumbnails') this.oW('requestRenderThumbnails');
            });
            K.dT.push(function(P, Q) {
                Q = this;
                P.on('afterCommandExecDefered', function(R) {
                    if (!R.data) return;
                    var S = R.data.name,
                        T;
                    if (S == 'RenameFile') {
                        var U = R.data.file,
                            V = Q.tools.oO().length > 1;
                        T = U && U.folder;
                        if (Q.tools.currentFolder() != T) return;
                        Q.oW('requestRenderFiles', {
                            folder: T,
                            lK: 1
                        }, function(W) {
                            if (W) return;
                            U.deselect(true);
                            Q.oW('requestSelectFile', {
                                file: R.data.file,
                                multiple: V
                            }, function() {
                                if (W) return;
                                U.focus(V);
                            });
                        });
                    } else if (S == 'RemoveFiles') {
                        T = R.data.folder;
                        if (Q.tools.currentFolder() != T) return;
                        Q.tools.cR();
                        Q.bn().focus();
                        Q.oW('requestRenderFiles', {
                            folder: T,
                            lK: 1
                        });
                    }
                });
            });
            K.bh('SelectFile', ['click', 'requestSelectFile'], function U(P) {
                var Q = this.tools.bZ(P),
                    R = P.name == 'click',
                    S = P.data && P.data.multiple && this.app.config.selectMultiple;
                if (!(M.length >> 4)) return;
                if (R && P.data.db() >= a.bP) {
                    P.data.preventDefault();
                    S = (P.data.$.ctrlKey || P.data.$.metaKey) && this.app.config.selectMultiple;
                }
                if (R) if (P.data.bK().hasClass('dropdown')) {
                    P.jN.oW('contextmenu', P.data);
                    P.cancel();
                    return;
                }
                var T = i.extend({}, P.data, {
                    file: Q
                }, true);
                this.oW('beforeSelectFile', T, function aT(V, W) {
                    var bm = this;
                    if (V) return;
                    var X = W.file;
                    try {
                        if (bm.tools.dH() && !S) {
                            var Y = bm.tools.oO();
                            for (var Z = 0; Z < Y.length; Z++) Y[Z].rowNode() && Y[Z].rowNode().removeClass('selected');
                            bm.data().nY = [];
                        }
                        if (X && S && X.rowNode().hasClass('selected') && bm.tools.dH()) {
                            var Y = bm.tools.oO(),
                                aa = [];
                            for (var Z = 0; Z < Y.length; Z++) {
                                if (Y[Z].isSameFile(X)) Y[Z].rowNode().removeClass('selected');
                                else {
                                    if (!Y[Z].rowNode().hasClass('selected')) Y[Z].rowNode().addClass('selected');
                                    aa.push(Y[Z]);
                                }
                            }
                            bm.data().nY = aa;
                            if (bm.data().cG.isSameFile(X)) bm.data().cG = bm.data().nY[aa.length - 1];
                            R && bm.tools.cR(bm.tools.dH(), true, aa.length > 1);
                        } else if (X) {
                            X.rowNode().addClass('selected');
                            if (!bm.data().nY) bm.data().nY = [];
                            bm.data().cG = X;
                            bm.data().nY.push(X);
                            R && bm.tools.cR(X, S, S);
                        } else if (bm.tools.dH() && !S) {
                            bm.data().cG = null;
                            bm.data().nY = [];
                            bm.tools.cR();
                        }
                        bm.oW('successSelectFile', W);
                        bm.oW('afterSelectFile', W);
                    } catch (bW) {
                        bm.oW('failedSelectFile', W);
                        bm.oW('afterSelectFile', W);
                        throw a.ba(bW);
                    }
                });
            });
            K.bh('AddFiles', ['requestAddFiles'], function R(P) {
                var Q = i.extend({
                    eu: 0,
                    view: 'thumbnails',
                    mj: null
                }, P.data, {
                    files: P.data.file ? [P.data.file] : P.data.files
                }, true);
                this.oW('beforeAddFiles', Q, function eS(S, T) {
                    if (S) return;
                    try {
                        var U = this,
                            V = U.bn(),
                            W = U.data().hA,
                            X = 0,
                            Y, Z;
                        V.removeClass('files_message');
                        if (y()) {
                            if (T.files.length) T.mj = M;
                            X = 1;
                        }
                        if (T.dA == 'list') {
                            if (!this.data().kQ) this.data().kQ = i.bind(this.tools.qc, this.tools);
                            V.removeClass('files_thumbnails');
                            V.addClass('files_details');
                            Y = G(T.files, this.data().kQ);
                            Z = this.tools.fF();
                            var aa = this.tools.kj();
                            if (W && W != 'list') this.tools.lP().setHtml('');
                            if (g) {
                                if (aa && W && W == 'list' && !T.eu) Y = aa.getHtml() + Y;
                                if (Z) Z.remove();
                                if (Y) {
                                    var aT = u[0] + this.tools.lz() + u[1] + Y + u[2] + u[3];
                                    V.appendHtml(aT);
                                }
                                this.tools.releaseDomNodes(['detailsContentNode', 'detailsRootNode']);
                            } else if (Y) {
                                if (T.eu) this.tools.fF().setHtml(this.tools.lz() + u[1] + Y + u[2]);
                                else aa.appendHtml(Y);
                            } else Z.setHtml('');
                        } else {
                            V.removeClass('files_details');
                            V.addClass('files_thumbnails');
                            var bm = this.data().display;
                            Y = G(T.files, function(fv) {
                                var aP = 'r' + fv.index,
                                    bV = [];
                                bV.push('<a id="', aP);
                                bV.push('" class="file_entry" tabindex="-1" role="listiem presentation" href="javascript:void(0)" title="', i.htmlEncode(fv.name).replace('"', '&quot;'), '" aria-labelledby="', aP);
                                bV.push('_label" aria-describedby="', aP, '_details" style="width: ' + (U.app.config.thumbsWidth + 10) + 'px">');
                                bV.push(r, '<div class="image"><div role="img" style="width: ' + U.app.config.thumbsWidth + 'px; height: ' + U.app.config.thumbsHeight + 'px"></div></div>');
                                if (bm.filename) bV.push('<h5 id="', aP, '_label">', i.htmlEncode(fv.name), '</h5>');
                                bV.push('<span id="' + aP + '_details" class="details" role="list presentation">');
                                if (bm.date) bV.push('<span role="listitem" class="extra">', fv.dateF, '</span>');
                                if (bm.filesize) bV.push('<span role="listitem" aria-label="Size">', i.formatSize(fv.size, U.app.lang, true), '</span>');
                                bV.push('</span></a>');
                                return bV.join('');
                            });
                            Z = this.tools.lP();
                            if (W && W == 'list') {
                                var bW = this.tools.fF();
                                if (bW && g) bW.remove();
                                else if (bW) bW.setHtml('');
                            }
                            if (T.eu) Z.setHtml(Y);
                            else Z.appendHtml(Y);
                        }
                        if (!X && (!p || a.bs.indexOf(p) % 8 < 5)) {
                            T.mj = N;
                            X = 1;
                        }
                        if ((T.eu && !Y || X) && T.mj) {
                            V.addClass('files_message');
                            this.tools.of().setHtml(T.mj);
                        }
                        if (!p && !X) Z.setHtml('');
                        this.oW('successAddFiles');
                        this.oW('afterAddFiles');
                    } catch (fv) {
                        this.oW('failedAddFiles');
                        this.oW('afterAddFiles');
                        throw a.ba(fv);
                    }
                });
            });
            K.bh('ShowFolderFiles', ['requestShowFolderFiles'], function T(P) {
                var Q = this,
                    R = a.aG.bX['foldertree.foldertree'].tools.cq(P),
                    S = i.extend({}, P.data, {
                        folder: R
                    }, true);
                this.oW('beforeShowFolderFiles', S, function Y(U, V) {
                    if (U) return;
                    if (this.tools.dH()) this.oW('requestSelectFile');
                    this.app.cS('refresh').bR(a.aY);
                    try {
                        var W = V.folder,
                            X;
                        if (!W.acl.folderView) {
                            Q.app.msgDialog('', Q.app.lang.Errors[103]);
                            throw '[CKFINDER] No permissions to view folder.';
                        }
                        P.data.ib = this;
                        this.data().folder = W;
                        Q.tools.kR();
                        this.oW('requestRenderFiles', {
                            eu: 1,
                            mj: Q.app.lang.FilesLoading
                        });
                        this.app.connector.sendCommand('GetFiles', X, function(Z) {
                            Q.app.cS('refresh').bR(a.aS);
                            if (Q.app.aV != W) {
                                Q.oW('failedShowFolderFiles', V);
                                Q.oW('afterShowFolderFiles', V);
                                return;
                            }
                            if (Z.checkError() || y.toString().length < 200) return;
                            Q.tools.kR();
                            var aa, aT = Z.selectNodes('Connector/Files/File');
                            for (var bm = 0; bm < aT.length; bm++) {
                                var bW = aT[bm].attributes.getNamedItem('date').value,
                                    eS = aT[bm].attributes.getNamedItem('name').value,
                                    fv = Q.tools.rg(new a.aL.File(eS, parseInt(aT[bm].attributes.getNamedItem('size').value, 10), aT[bm].attributes.getNamedItem('thumb') ? aT[bm].attributes.getNamedItem('thumb').value : false, bW, Q.app.lB(bW.substr(6, 2), bW.substr(4, 2), bW.substr(0, 4), bW.substr(8, 2), bW.substr(10, 2)), W));
                                if (V.mw && eS == V.mw) aa = fv;
                            }
                            Q.oW('requestRenderFiles', {
                                mj: Q.app.lang.FilesEmpty
                            });
                            if (aa) {
                                Q.app.oW('requestSelectFile', {
                                    file: aa,
                                    scrollTo: 1
                                });
                                setTimeout(function() {
                                    aa.aNode().$.scrollIntoView(1);
                                    Q.app.layout.mB().getFirst().$.scrollIntoView(0);
                                }, f.opera ? 500 : 100);
                            }
                            Q.oW('successShowFolderFiles', V);
                            Q.oW('afterShowFolderFiles', V);
                            x(Q);
                        }, W.type, W);
                    } catch (Z) {
                        this.oW('failedShowFolderFiles', V);
                        this.oW('afterShowFolderFiles', V);
                        throw a.ba(Z);
                    }
                });
            });
            K.tools.bZ = function(P) {
                var U = this;
                var Q, R = 0;
                if (P.data && P.data.file instanceof k) {
                    P = P.data.file;
                    R = 1;
                } else if (P.data && P.data.bK) {
                    P = P.data.bK();
                    R = 1;
                } else if (P instanceof h.bi) R = 1;
                if (R) {
                    var S = P;
                    while (S && (!S.is('a') || !S.hasAttribute('id')) && !S.is('tr')) {
                        if (S == U.ib.eh) break;
                        S = S.getParent();
                    }
                    if (S) {
                        var T = S.dS();
                        if (T && (S.is('a') || S.is('tr'))) Q = U.ib.data().files[S.dS().slice(1)];
                    }
                } else if (typeof P == 'number') Q = U.ib.data().files[P];
                else if (typeof P == 'String') Q = U.ib.data().files[S.dS().slice(1)];
                else if (P.data && P.data.file && P.data.file instanceof a.aL.File) Q = P.data.file;
                else if (P.data && P.data.files && P.data.files.length && P.data.files[0] && P.data.files[0] instanceof a.aL.File) Q = P.data.files[0];
                else if (P instanceof a.aL.File) Q = P;
                return Q;
            };
            K.tools.kR = function() {
                var P = this.ib.data();
                P.files.length = 0;
                P.cP = {};
            };
            K.tools.oR = function(P, Q) {
                var R = P.thumb,
                    S = P.name,
                    T = this.ib.app,
                    U = S.match(T.rQ.jf);
                if (U && (U = U[0]) && T.rQ.jh.test(U)) return T.fh + 'images/icons/' + (Q ? '32' : '16') + '/' + U.toLowerCase() + '.gif';
                return T.fh + 'images/icons/' + (Q ? '32' : '16') + '/default.icon.gif';
            };
            K.tools.rg = function(P) {
                var Q = this.ib.data().files,
                    R = Q.push(P);
                P.index = --R;
                P.app = this.ib.app;
                return P;
            };
            K.tools.lP = function(P) {
                var Q = this;
                if (!Q.jl) Q.jl = Q.ib.bn().getChild(1);
                return Q.jl;
            };
            K.tools.kj = function(P) {
                var R = this;
                if (R.iJ === undefined) {
                    var Q = R.fF();
                    R.iJ = Q ? J(I(Q.$.childNodes, 'tbody')) : null;
                }
                return R.iJ;
            };
            K.tools.sn = function(P) {
                var R = this;
                if (R.kT === undefined) {
                    var Q = R.fF();
                    R.kT = Q ? J(I(Q.$.childNodes, 'thead')) : null;
                }
                return R.kT;
            };
            K.tools.fF = function(P) {
                var Q = this;
                if (Q.iO === undefined) Q.iO = J(I(Q.ib.bn().$.childNodes, 'table'));
                return Q.iO;
            };
            K.tools.of = function(P) {
                var Q = this;
                if (!Q.iF) Q.iF = Q.ib.bn().getChild(0);
                return Q.iF;
            };
            K.tools.releaseDomNodes = function(P) {
                var Q = this;
                Q.jl = undefined;
                Q.iO = undefined;
                Q.iJ = undefined;
                Q.iF = undefined;
            };
            K.tools.lz = function() {
                var S = this;
                var P = S.ib.data().display,
                    Q = [];
                Q.push('<td class="name">' + S.ib.app.lang.SetDisplayName + '</td>');
                if (P.filesize) Q.push('<td>' + S.ib.app.lang.SetDisplaySize + '</td>');
                if (P.date) Q.push('<td>' + S.ib.app.lang.SetDisplayDate + '</td>');
                var R = Q.length - 1;
                if (R) Q[R] = '<td class="last">' + Q[R].substr(4);
                else Q[R] = '<td class="last ' + Q[R].substr(11);
                return '<thead><tr><td>&nbsp;</td>' + Q.join('') + '</tr>' + '</thead>';
            };
            K.tools.qc = function(P) {
                var Q = this.oR(P),
                    R = 'r' + P.index,
                    S = this.ib.data().display,
                    T = [];
                T.push('<td class="name">' + s + '<a tabindex="-1">' + (S.filename ? i.htmlEncode(P.name) : '') + '</a>' + '</td>');
                if (S.filesize) T.push('<td>' + i.formatSize(P.size, this.ib.app.lang, true) + '</td>');
                if (S.date) T.push('<td>' + P.dateF + '</td>');
                var U = T.length - 1;
                if (U) T[U] = '<td class="last">' + T[U].substr(4);
                else T[U] = '<td class="last ' + T[U].substr(11);
                return '<tr id="' + R + '">' + '<td class="image">' + '<img src="' + Q + '" alt="img alt" />' + '</td>' + T.join('') + '</tr>';
            };
            K.tools.dH = function() {
                var P = this.ib.data();
                if (P.cG) if (!P.cG.isDeleted) return P.cG;
                else return P.cG = null;
            };
            K.tools.oO = function(P) {
                var Q = this.ib.data(),
                    R = [];
                if (Q.nY) {
                    for (var S = 0; S < Q.nY.length; S++) {
                        if (Q.nY[S] && !Q.nY[S].isDeleted) R.push(Q.nY[S]);
                    }
                    if (P) {
                        var T = R,
                            U = {},
                            R = [];
                        for (S = 0; S < T.length; S++) {
                            if (!(T[S].name in U)) {
                                R.push(T[S]);
                                U[T[S].name] = 1;
                            }
                        }
                    }
                }
                return Q.nY = R;
            };
            K.tools.currentFolder = function() {
                return this.ib.data().folder;
            };
            K.tools.cR = function(P, Q, R) {
                var S = this;
                if (P) {
                    if (S.iS) S.iS.blur();
                    else S.ib.bn().setAttribute('tabindex', -1);
                    S.iS = P;
                    P.focus(Q, R);
                } else {
                    delete S.iS;
                    S.ib.bn().setAttribute('tabindex', 0);
                }
            };
            K.tools.downloadFile = function(P, Q) {
                var R = P.getById('downloadIframe');
                if (!R) {
                    R = P.createElement('iframe');
                    R.setAttribute('id', 'downloadIframe');
                    R.setStyle('display', 'none');
                    P.bH().append(R);
                }
                R.setAttribute('src', Q);
            };
        };

        function A(K, L, M, N, O, P) {
            var Q = {},
                R = 0,
                S = L.files,
                T = [L.destination];
            for (var U = 0, V = L.files.length; U < V; U++) {
                if (L.destination == S[U].folder) continue;
                Q['files[' + R + '][name]'] = S[U].name;
                Q['files[' + R + '][type]'] = S[U].folder.type;
                Q['files[' + R + '][folder]'] = S[U].folder.getPath();
                Q['files[' + R + '][options]'] = O && O[U] || '';
                R++;
                if (M && !N) T.push(S[U].folder);
            }
            if (!N) {
                if (!P) P = function() {};
                P = i.override(P, function(Z) {
                    return function() {
                        var aa = K.aG['filesview.filesview'],
                            aT = aa.tools.currentFolder();
                        for (var bm = 0, bW = T.length; bm < bW; bm++) {
                            if (T[bm] == aT) {
                                K.oW('requestSelectFolder', {
                                    folder: aT
                                });
                                break;
                            }
                        }
                        return Z;
                    };
                });
            }
            if (!R) {
                P && P();
                return;
            }
            var W = K.connector,
                X = 0,
                Y = M ? 'MoveFiles' : 'CopyFiles';
            W.sendCommandPost(Y, null, Q, function pw(Z) {
                var aa = Z.getErrorNumber(),
                    aT = [],
                    bm = [],
                    bW, eS, fv;
                for (bW = 0, eS = S.length; bW < eS; bW++) bm.push(S[bW]);
                if (aa == W.ERROR_COPY_FAILED || aa == W.ERROR_MOVE_FAILED) {
                    X = 1;
                    var aP = Z.selectNodes('Connector/Errors/Error'),
                        bV = parseInt(Z.selectSingleNode('Connector/' + (M ? 'MoveFiles/@moved' : 'CopyFiles/@copied')).value, 10),
                        eN = 0,
                        gB = [],
                        dX, gs, am, gP;
                    for (bW = 0, eS = aP.length; bW < eS; bW++) {
                        dX = aP[bW].getAttribute('code');
                        if (dX == W.ERROR_ALREADYEXIST) eN = 1;
                        else gB.push([aP[bW].getAttribute('name'), K.lang.Errors[dX]]);
                        for (gs = 0, am = bm.length; gs < am; gs++) {
                            if ((gP = bm[gs]) && gP.name == aP[bW].getAttribute('name') && gP.folder.getPath() == aP[bW].getAttribute('folder') && gP.folder.type == aP[bW].getAttribute('type')) {
                                if (aP[bW].getAttribute('code') == W.ERROR_ALREADYEXIST) aT.push(gP);
                                delete bm[gs];
                                break;
                            }
                        }
                    }
                    for (bW = 0, eS = gB.length; bW < eS; bW++) gB[bW] = K.lang.FileError.replace('%s', gB[bW][0]).replace('%e', gB[bW][1]);
                    if (!bV && !eN) K.msgDialog('', K.lang.Errors[M ? 300 : 301] + '<br /><br />' + C(gB), P || null);
                    else if (gB.length == bm.length - bV) {
                        fv = K.lang.OperationCompletedErrors + ' ' + K.lang[M ? 'MovedFilesNumber' : 'CopiedFilesNumber'].replace('%s', bV) + '<br /><br />';
                        fv += K.lang[M ? 'MoveFailedList' : 'CopyFailedList'].replace('%s', C(gB));
                        K.msgDialog('', fv, P || null);
                    }
                    var gR = B(K, bm, L.fileCallback);
                    eN && K.cg.openDialog('moveFileExists', function(aq) {
                        var ar = arguments.callee;
                        fv = '';
                        if (gB.length) fv += K.lang.OperationCompletedErrors + ' ';
                        fv += bV ? K.lang[M ? 'MovedFilesNumber' : 'CopiedFilesNumber'].replace('%s', bV) : '';
                        if (gB.length) fv += (fv ? '<br /><br />' : '') + K.lang[M ? 'MoveFailedList' : 'CopyFailedList'].replace('%s', C(gB));
                        fv && (fv += '<br /><br />');
                        var as = K.lang.ErrorMsg.FileExists;
                        as = as.replace('%s', aT[0]);
                        fv += '<strong>' + as + '</strong>';
                        aq.show();
                        aq.getContentElement('tab1', 'msg').getElement().setHtml(fv);
                        aq.on('ok', function az(at) {
                            at.removeListener();
                            var au = aq.getContentElement('tab1', 'option').getValue(),
                                av = aq.getContentElement('tab1', 'remember').getValue(),
                                aw;
                            switch (au) {
                                case 'autorename':
                                case 'overwrite':
                                    aw = [au];
                                    break;
                                case 'skip':
                                    if (!av) {
                                        aT.shift();
                                        aT.length && setTimeout(function() {
                                            K.cg.openDialog('moveFileExists', ar);
                                        }, 0);
                                    } else P && P();
                                    return;
                                    break;
                            }
                            if (av) for (var ax = 1, ay = aT.length; ax < ay; ax++) aw.push(aw[0]);
                            A(K, i.extend({
                                files: aT
                            }, L), M, 1, aw, P);
                        });
                    });
                    if (N) return;
                } else if (Z.checkError()) X = 1;
                if (X) {
                    L.errorCallback && L.errorCallback();
                    return;
                }
                var gR = B(K, bm, L.fileCallback);
                if (gR) {
                    fv = K.lang.OperationCompletedSuccess + '<br />' + K.lang[M ? 'MovedFilesNumber' : 'CopiedFilesNumber'].replace('%s', gR);
                    K.msgDialog('', fv, P || null);
                } else P && P();
            }, L.destination.type, L.destination);
        };

        function B(K, L, M) {
            var N = 0,
                O;
            for (var P = 0, Q = L.length; P < Q; P++) {
                if (!(O = L[P])) continue;
                N++;
                M && M(K, O);
            }
            return N;
        };

        function C(K) {
            return '<ul class="cke_files_list' + (K.length > 3 ? ' cke_files_list_many' : '') + '"><li>' + K.join('</li><li>') + '</li></ul>';
        };
        a.aL.File = function(K, L, M, N, O, P) {
            var Q = this;
            Q.index = null;
            Q.app = null;
            Q.name = K;
            Q.ext = K.match(q.fX)[0];
            Q.nameL = K.toLowerCase();
            Q.size = L;
            Q.thumb = M;
            Q.date = N;
            Q.dateF = O;
            Q.folder = P;
            Q.isDeleted = false;
        };
        a.aL.File.prototype = {
            rename: function(K) {
                D(K, this.app);
                var L = this;
                if (L.name == K) {
                    L.app.oW('afterCommandExecDefered', {
                        name: 'RenameFile',
                        file: L
                    });
                    return;
                }
                L.app.oW('requestProcessingFile', {
                    file: L
                });
                L.app.connector.sendCommandPost('RenameFile', {
                    fileName: L.name,
                    newFileName: K
                }, null, function(M) {
                    if (M.checkError()) {
                        L.app.oW('requestRepaintFile', {
                            file: L
                        });
                        return;
                    }
                    L.name = M.selectSingleNode('Connector/RenamedFile/@newName').value;
                    L.nameL = L.name.toLowerCase();
                    L.ext = L.name.match(q.fX)[0];
                    L.thumb = 0;
                    L.app.oW('afterCommandExecDefered', {
                        name: 'RenameFile',
                        file: L
                    });
                }, L.folder.type, L.folder);
            },
            remove: function() {
                E(this.app, [this]);
            },
            select: function(K) {
                this.app.oW('requestSelectFile', {
                    file: this,
                    multiple: K
                });
            },
            deselect: function(K) {
                K ? this.select(true) : this.app.oW('requestSelectFile');
            },
            'toString': function() {
                return this.name;
            },
            isImage: function() {
                return this.app.rQ.rO.test(this.ext);
            },
            isSameFile: function(K) {
                var L = this;
                return (L.name == K.name || L.index == K.index) && L.folder.getPath() == K.folder.getPath() && L.folder.type == K.folder.type;
            },
            getUrl: function() {
                return this.folder.getUrl() + encodeURIComponent(this.name);
            },
            rowNode: function() {
                var K = this;
                if (!K.je) K.je = K.app.document.getById('r' + K.index);
                return K.je;
            },
            getThumbnailUrl: function(K) {
                var R = this;
                var L = R.thumb,
                    M = R.name,
                    N = R.app,
                    O = M.match(N.rQ.jf);
                if (O && (O = O[0])) {
                    if (N.config.thumbsEnabled && N.rQ.rO.test(O)) {
                        var P = encodeURIComponent(R.date + '-' + R.size);
                        if (L && N.config.thumbsDirectAccess) return N.config.thumbsUrl + R.folder.type + R.folder.getPath() + encodeURIComponent(M) + (!K ? '' : '?hash=' + N.getResourceType(R.folder.type).hash + '&fileHash=' + P);
                        var Q = {
                            FileName: M
                        };
                        if (K) Q.fileHash = P;
                        return N.connector.composeUrl('Thumbnail', Q, R.folder.type, R.folder);
                    }
                    if (N.config.useNativeIcons && f.gecko) return 'moz-icon://.' + O.toLowerCase() + '?size=32';
                    if (N.rQ.jh.test(O)) return N.fh + 'images/icons/32/' + O.toLowerCase() + '.gif';
                }
                return N.fh + 'images/icons/32/default.icon.gif';
            },
            filenameNode: function() {
                var L = this;
                if (L.ht === undefined) {
                    var K = L.rowNode();
                    if (K) if (K.is('a')) L.ht = J(I(K.$.childNodes, 'h5'));
                    else L.ht = J(I(L.aNode().$.childNodes, 'h5'));
                }
                return L.ht;
            },
            aNode: function() {
                var M = this;
                if (M.dM === undefined) {
                    var K = M.rowNode();
                    if (K) if (K.is('a')) M.dM = K;
                    else {
                        var L = I(K.$.childNodes, 'td', 1);
                        M.dM = J(I(L.childNodes, 'a'));
                    }
                }
                return M.dM;
            },
            focusNode: function() {
                return this.aNode();
            },
            releaseDomNodes: function() {
                this.je = undefined;
                this.dM = undefined;
                this.ht = undefined;
            },
            focus: function(K, L) {
                !L && this.select(K);
                var M = this.focusNode();
                M.setAttribute('tabindex', 0);
                M.focus();
            },
            blur: function() {
                this.aNode().setAttribute('tabindex', -1);
            }
        };

        function D(K, L) {
            if (!K || K.length === 0) throw new a.dU('name_empty', L.lang.ErrorMsg.pg);
            if (q.iz.test(K)) throw new a.dU('name_invalid_chars', L.lang.ErrorMsg.oP);
            return true;
        };

        function E(K, L) {
            var M = {},
                N = L[0].folder,
                O = N.getPath();
            for (var P = 0, Q = L.length; P < Q; P++) {
                M['files[' + P + '][name]'] = L[P].name;
                M['files[' + P + '][type]'] = N.type;
                M['files[' + P + '][folder]'] = O;
                K.oW('requestProcessingFile', {
                    file: L[P]
                });
            }
            K.connector.sendCommandPost('DeleteFiles', null, M, function(R) {
                var S = {},
                    T, U;
                if (R.getErrorNumber() == 302) {
                    var V = L.length - parseInt(R.selectSingleNode('Connector/DeleteFiles/@deleted').value, 10);
                    if (V) {
                        var W = R.selectNodes('Connector/Errors/Error');
                        for (T = 0, U = W.length; T < U; T++) S[W[T].attributes.getNamedItem('name').value] = 1;
                        K.skippedFilesDialog(null, W);
                    } else {
                        R.checkError();
                        return;
                    }
                } else if (R.checkError()) return;
                for (T = 0, U = L.length; T < U; T++) {
                    if (!S[L[T]]) {
                        L[T].isDeleted = true;
                        L[T].releaseDomNodes();
                    }
                }
                K.oW('afterCommandExecDefered', {
                    name: 'RemoveFiles',
                    folder: N
                });
            }, N.type, N);
        };

        function F() {
            i.extend(a.aL.Folder.prototype, {
                getFiles: function(K) {
                    var L = this,
                        M = this.app;
                    M.connector.sendCommand('GetFiles', {}, function(N) {
                        var O = [],
                            P = N.selectNodes('Connector/Files/File');
                        for (var Q = 0; Q < P.length; Q++) {
                            var R = P[Q].attributes.getNamedItem('date').value;
                            O.push(new a.aL.File(P[Q].attributes.getNamedItem('name').value, parseInt(P[Q].attributes.getNamedItem('size').value, 10), P[Q].attributes.getNamedItem('thumb') ? P[Q].attributes.getNamedItem('thumb').value : false, R, M.lB(R.substr(6, 2), R.substr(4, 2), R.substr(0, 4), R.substr(8, 2), R.substr(10, 2)), L));
                        }
                        if (K) K.call(L, O);
                    }, L.type, L);
                },
                showFiles: function(K) {
                    this.app.oW('requestShowFolderFiles', {
                        folder: this,
                        mw: K
                    });
                }
            });
        };

        function G(K, L) {
            if (!K) return undefined;
            var M = [];
            for (var N = 0; N < K.length; N++) M.push(L(K[N]));
            return M.join('');
        };

        function H(K, L) {
            for (var M in K) {
                if (L(K[M]) !== undefined) return K[M];
            }
            return undefined;
        };

        function I(K, L, M) {
            return H(K, function(N) {
                if (N.tagName && N.tagName.toLowerCase() == L && !M--) return N;
            });
        };

        function J(K) {
            return K ? new k(K) : null;
        };
    })();
    (function() {
        function p(x, y) {
            var z = [];
            if (!y) return x;
            else for (var A in y) z.push(A + '=' + encodeURIComponent(y[A]));
            return x + (x.indexOf('?') != -1 ? '&' : '?') + z.join('&');
        };

        function q(x) {
            x += '';
            var y = x.charAt(0).toUpperCase();
            return y + x.substr(1);
        };

        function r(x) {
            var A = this;
            var y = A.getDialog(),
                z = y.getParentApi();
            z._.rb = A;
            if (!y.getContentElement(A['for'][0], A['for'][1]).getInputElement().$.value) return false;
            if (!y.getContentElement(A['for'][0], A['for'][1]).vy()) return false;
            return true;
        };

        function s(x, y, z) {
            var A = z.params || {};
            if (!z.url) return;
            A.CKFinderFuncNum = x._.ra;
            if (!A.langCode) A.langCode = x.langCode;
            y.action = p(z.url, A);
            y.filebrowser = z;
        };

        function t(x, y, z, A) {
            var B, C;
            for (var D in A) {
                B = A[D];
                if (B.type == 'hbox' || B.type == 'vbox') t(x, y, z, B.children);
                if (!B.filebrowser) continue;
                if (B.type == 'fileButton' && B['for']) {
                    if (typeof B.filebrowser == 'string') {
                        var E = {
                            target: B.filebrowser
                        };
                        B.filebrowser = E;
                    }
                    B.filebrowser.action = 'QuickUpload';
                    var F = B.filebrowser.url;
                    if (!F) {
                        var G = B.onShow;
                        B.onShow = function(I) {
                            var J = I.jN;
                            if (G && G.call(J, I) === false) return false;
                            var K = x.getSelectedFolder();
                            if (K) F = K.getUploadUrl();
                            if (!F) return false;
                            var L = B.filebrowser.params || {};
                            L.CKFinderFuncNum = x._.ra;
                            if (!L.langCode) L.langCode = x.langCode;
                            F = p(F, L);
                            var M = this.getDialog().getContentElement(B['for'][0], B['for'][1]);
                            if (!M) return false;
                            M._.dg.action = F;
                            M.reset();
                            return true;
                        };
                    } else {
                        B.filebrowser.url = F;
                        B.hidden = false;
                        s(x, z.vz(B['for'][0]).eB(B['for'][1]), B.filebrowser);
                    }
                    var H = B.onClick;
                    B.onClick = function(I) {
                        var J = I.jN;
                        if (H && H.call(J, I) === false) return false;
                        return r.call(J, I);
                    };
                }
            }
        };

        function u(x, y) {
            var z = y.getDialog(),
                A = y.filebrowser.target || '';
            if (A) {
                var B = A.split(':'),
                    C = z.getContentElement(B[0], B[1]);
                if (C) {
                    C.setValue(x);
                    z.selectPage(B[0]);
                }
            }
        };

        function v(x, y, z) {
            if (z.indexOf(';') !== -1) {
                var A = z.split(';');
                for (var B = 0; B < A.length; B++) {
                    if (v(x, y, A[B])) return true;
                }
                return false;
            }
            var C = x.vz(y).eB(z).filebrowser;
            return C && C.url;
        };

        function w(x, y) {
            var C = this;
            var z = C._.rb.getDialog(),
                A = C._.rb['for'],
                B = C._.rb.filebrowser.onSelect;
            if (A) z.getContentElement(A[0], A[1]).reset();
            if (typeof y == 'function' && y.call(C._.rb) === false) return;
            if (B && B.call(C._.rb, x, y) === false) return;
            if (typeof y == 'string' && y) alert(y);
            if (x) u(x, C._.rb);
        };
        m.add('filebrowser', {
            bz: function(x) {
                x.cg._.ra = i.addFunction(w, x.cg);
            }
        });
        a.on('dialogDefinition', function(x) {
            var y = x.data.dg,
                z;
            for (var A in y.contents) {
                z = y.contents[A];
                t(x.application.cg, x.data.name, y, z.elements);
                if (z.hidden && z.filebrowser) z.hidden = !v(y, z.id, z.filebrowser);
            }
        });
    })();
    m.add('button', {
        eK: function(p) {
            p.bY.kd(a.UI_BUTTON, n.button.dq);
        }
    });
    CKFinder._.UI_BUTTON = a.UI_BUTTON = 1;
    n.button = function(p) {
        i.extend(this, p, {
            title: p.label,
            className: p.className || p.command && 'cke_button_' + p.command || '',
            click: p.click || (function(q) {
                if (p.command) q.execCommand(p.command);
                else if (p.onClick) p.onClick(q);
            })
        });
        this._ = {};
    };
    n.button.dq = {
        create: function(p) {
            return new n.button(p);
        }
    };
    n.button.prototype = {
        canGroup: true,
        er: function(p, q) {
            var r = f,
                s = this._.id = 'cke_' + i.getNextNumber();
            this._.app = p;
            var t = {
                    id: s,
                    button: this,
                    app: p,
                    focus: function() {
                        var z = p.document.getById(s);
                        z && z.focus();
                    },
                    lc: function() {
                        this.button.click(p);
                    }
                },
                u = i.addFunction(t.lc, t),
                v = n.button._.instances.push(t) - 1,
                w = '',
                x = this.command;
            if (this.iH) p.on('mode', function() {
                this.bR(this.iH[p.mode] ? a.aS : a.aY);
            }, this);
            else if (x) {
                x = p.cS(x);
                if (x) {
                    x.on('bu', function() {
                        this.bR(x.bu);
                    }, this);
                    w += 'cke_' + (x.bu == a.eV ? 'on' : x.bu == a.aY ? 'disabled' : 'off');
                }
            }
            if (!x) w += 'cke_off';
            if (this.className) w += ' ' + this.className;
            q.push('<span class="cke_button">', '<a id="', s, '" class="', w, '" href="javascript:void(\'', (this.title || '').replace("'", ''), '\')" title="', this.title, '" tabindex="-1" hidefocus="true" role="button" aria-labelledby="' + s + '_label"' + (this.vZ ? ' aria-haspopup="true"' : ''));
            if (r.opera || r.gecko && r.mac) q.push(' onkeypress="return false;"');
            if (r.gecko) q.push(' onblur="this.style.cssText = this.style.cssText;"');
            q.push(' onkeydown="window.parent.CKFinder._.uiButtonKeydown(', v, ', event);" onfocus="window.parent.CKFinder._.uiButtonFocus(', v, ', event);" onclick="window.parent.CKFinder._.callFunction(', u, ', this); return false;">');
            if (this.icon !== false) q.push('<span class="cke_icon"');
            if (this.icon) {
                var y = (this.rD || 0) * -16;
                q.push(' style="background-image:url(', a.getUrl(this.icon), ');background-position:0 ' + y + 'px;"');
            }
            if (this.icon !== false) q.push('></span>');
            q.push('<span id="', s, '_label" class="cke_label">', this.label, '</span>');
            if (this.vZ) q.push('<span class="cke_buttonarrow"></span>');
            q.push('</a>', '</span>');
            if (this.onRender) this.onRender();
            return t;
        },
        bR: function(p) {
            var u = this;
            if (u._.bu == p) return false;
            u._.bu = p;
            var q = u._.app.document.getById(u._.id);
            if (q) {
                q.bR(p);
                p == a.aY ? q.setAttribute('aria-disabled', true) : q.removeAttribute('aria-disabled');
                p == a.eV ? q.setAttribute('aria-pressed', true) : q.removeAttribute('aria-pressed');
                var r = u.title,
                    s = u._.app.lang.common.unavailable,
                    t = q.getChild(1);
                if (p == a.aY) r = s.replace('%1', u.title);
                t.setHtml(r);
                return true;
            } else return false;
        }
    };
    n.button._ = {
        instances: [],
        keydown: function(p, q) {
            var r = n.button._.instances[p];
            if (r.onkey) {
                q = new h.event(q);
                return r.onkey(r, q.db()) !== false;
            }
        },
        focus: function(p, q) {
            var r = n.button._.instances[p],
                s;
            if (r.onfocus) s = r.onfocus(r, new h.event(q)) !== false;
            if (f.gecko && f.version < 10900) q.preventBubble();
            return s;
        }
    };
    CKFinder._.uiButtonKeydown = n.button._.keydown;
    CKFinder._.uiButtonFocus = n.button._.focus;
    n.prototype.qW = function(p, q) {
        this.add(p, a.UI_BUTTON, q);
    };
    (function() {
        m.add('container', {
            bM: [],
            bz: function(p) {
                var q = this;
                p.on('themeAvailable', function() {
                    q.pV(p);
                });
            },
            pV: function(p) {
                var q = p.config.height,
                    r = p.config.tabIndex || p.element.getAttribute('tabindex') || 0;
                if (!isNaN(q)) {
                    q = Math.max(q, 200);
                    q += 'px';
                }
                var s = '',
                    t = p.config.width;
                if (t) {
                    if (!isNaN(t)) t += 'px';
                    s += 'width: ' + t + ';';
                }
                var u = p.config.className ? 'class="' + p.config.className + '"' : '',
                    v = f.isCustomDomain(),
                    w = 'document.open();' + (v ? 'document.domain="' + window.document.domain + '";' : '') + 'document.close();',
                    x = k.kE('<iframe style="' + s + 'height:' + q + '"' + u + ' frameBorder="0"' + ' src="' + (g ? 'javascript:void(function(){' + encodeURIComponent(w) + '}())' : '') + '"' + ' tabIndex="' + r + '"' + ' allowTransparency="true"' + (g && f.version >= 9 && p.cg.inPopup ? ' onload="typeof ckfinder !== "undefined" && ckfinder();"' : '') + '></iframe>', p.element.getDocument());

                function y(A) {
                    A && A.removeListener();
                    var B = x.getFrameDocument().$;
                    B.open();
                    if (v) B.domain = document.domain;
                    p.document = new j(B);
                    p.theme.dQ(p);
                    B.close();
                    (B.defaultView || B.parentWindow).CKFinder = CKFinder;
                    a.skins.load(p, 'application', function() {
                        var D = p.dJ;
                        if (D) D.oA(p.document);
                    });
                    if (!x.isVisible() && g && f.version >= 8) var C = setInterval(function() {
                        if (x.isVisible()) {
                            p.layout.ea(true);
                            C = clearInterval(C);
                        }
                    }, 500);
                };
                if (g && f.version >= 9 && p.cg.inPopup) p.element.getDocument().getWindow().$.ckfinder = function() {
                    p.element.getDocument().getWindow().$.ckfinder = undefined;
                    y();
                };
                x.on('load', y);
                var z = p.lang.appTitle.replace('%1', p.name);
                if (f.gecko) {
                    x.on('load', function(A) {
                        A.removeListener();
                    });
                    p.element.setAttributes({
                        role: 'region',
                        title: z
                    });
                    x.setAttributes({
                        role: 'region',
                        title: ' '
                    });
                } else if (f.webkit) {
                    x.setAttribute('title', z);
                    x.setAttribute('name', z);
                } else if (g) x.appendTo(p.element);
                if (!g) p.element.append(x);
                p.container = x;
            }
        });
        a.application.prototype.focus = function() {
            var r = this;
            if (r._.oO && r._.oO.length > 1) {
                r.oW('requestSelectFile');
                for (var p = 0, q = r._.oO.length; p < q; p++) r.oW('requestSelectFile', {
                    file: r._.oO[p],
                    multiple: true
                });
            }(r._.activeElement ? k.eB(r._.activeElement) : r.document.getWindow()).focus();
        };
    })();
    m.add('contextmenu', {
        bM: ['menu'],
        eK: function(p) {
            p.bj = new m.bj(p);
            p.bD('bj', {
                exec: function() {
                    var q = p.layout.pn(),
                        r, s, t;
                    if (q.hasClass('focus_inside')) {
                        t = p.aG['filesview.filesview'];
                        var u = t.tools.dH();
                        if (u) {
                            r = u.dM;
                            s = r.ir();
                            p.bj.show(p.document.bH().getParent(), null, s.x + 5, s.y + 5, r, q);
                            p._.activeElement = r;
                            p._.oO = t.tools.oO();
                            return;
                        }
                    }
                    q = p.layout.pS();
                    if (q.hasClass('focus_inside')) {
                        t = p.aG['foldertree.foldertree'];
                        var v = t.tools.ew;
                        if (v) {
                            r = v.dM;
                            s = r.ir();
                            p.bj.show(p.document.bH().getParent(), null, s.x + 5, s.y + 5, r, q);
                            p._.activeElement = r;
                            p._.oO = [];
                            return;
                        }
                    }
                }
            });
        }
    });
    m.bj = i.createClass({
        $: function(p) {
            this.id = 'cke_' + i.getNextNumber();
            this.app = p;
            this._.dF = [];
            this._.vx = i.addFunction(function(q) {
                this._.panel.hide();
                p.focus && p.focus();
            }, this);
        },
        _: {
            onMenu: function(p, q, r, s, t, u) {
                var v = this._.menu,
                    w = this.app;
                if (v) {
                    v.hide();
                    v.ih();
                } else {
                    v = this._.menu = new a.menu(w);
                    v.onClick = i.bind(function(E) {
                        var F = true;
                        v.hide();
                        if (g) w.focus && w.focus();
                        if (E.onClick) E.onClick();
                        else if (E.command) w.execCommand(E.command);
                        F = false;
                    }, this);
                }
                v.onEscape = function() {
                    w.focus && w.focus();
                    t.focus && t.focus();
                    w._.activeElement = null;
                };
                var x = this._.dF,
                    y = [];
                v.onHide = i.bind(function() {
                    v.onHide = null;
                    this.onHide && this.onHide();
                }, this);
                for (var z = 0; z < x.length; z++) {
                    var A = x[z];
                    if (A[1] && A[1].$ != u.$) continue;
                    var B = x[z][0](t);
                    if (B) for (var C in B) {
                        var D = this.app.mh(C);
                        if (D) {
                            D.bu = B[C];
                            v.add(D);
                        }
                    }
                }
                if (v.items.length) v.show(p, q || (w.lang.dir == 'rtl' ? 2 : 1), r, s);
            }
        },
        ej: {
            lX: function(p, q) {
                if (f.opera && !('oncontextmenu' in document.body)) {
                    var r;
                    p.on('mousedown', function(v) {
                        v = v.data;
                        if (v.$.button != 2) {
                            if (v.db() == a.bP + 1) p.oW('contextmenu', v);
                            return;
                        }
                        if (q && (v.$.ctrlKey || v.$.metaKey)) return;
                        var w = v.bK();
                        if (!r) {
                            var x = w.getDocument();
                            r = x.createElement('input');
                            r.$.type = 'button';
                            x.bH().append(r);
                        }
                        r.setAttribute('style', 'position:absolute;top:' + (v.$.clientY - 2) + 'px;left:' + (v.$.clientX - 2) + 'px;width:5px;height:5px;opacity:0.01');
                    });
                    p.on('mouseup', function(v) {
                        if (r) {
                            r.remove();
                            r = undefined;
                            p.oW('contextmenu', v.data);
                        }
                    });
                }
                p.on('contextmenu', function(v) {
                    var w = v.data;
                    if (q && (f.webkit ? s : w.$.ctrlKey || w.$.metaKey)) return;
                    w.preventDefault();
                    var x = w.bK(),
                        y = w.bK().getDocument().gT(),
                        z = w.$.clientX,
                        A = w.$.clientY;
                    i.setTimeout(function() {
                        this._.onMenu(y, null, z, A, x, p);
                    }, 0, this);
                }, this);
                if (f.opera) p.on('keypress', function(v) {
                    var w = v.data;
                    if (w.$.keyCode === 0) w.preventDefault();
                });
                if (f.webkit) {
                    var s, t = function(v) {
                            s = v.data.$.ctrlKey || v.data.$.metaKey;
                        },
                        u = function() {
                            s = 0;
                        };
                    p.on('keydown', t);
                    p.on('keyup', u);
                    p.on('contextmenu', u);
                }
            },
            kh: function(p, q) {
                this._.dF.push([p, q]);
            },
            show: function(p, q, r, s, t, u) {
                this.app.focus();
                this._.onMenu(p || a.document.gT(), q, r || 0, s || 0, t, u);
            }
        }
    });
    (function() {
        m.add('dragdrop', {
            bM: ['foldertree', 'filesview', 'contextmenu', 'dialog'],
            readOnly: false,
            gr: function u(r) {
                r.cK = new p(r);
                var s, t;
                r.on('themeSpace', function w(v) {
                    if (v.data.space == 'mainBottom') v.data.html += '<div id="dragged_container" style="display: none; position: absolute;"></div>';
                });
                r.on('uiReady', function(v) {
                    r.document.on('dragstart', function(x) {
                        x.data.preventDefault(true);
                    });
                    r.document.on('drag', function(x) {
                        x.data.preventDefault(true);
                    });
                    var w;
                    r.aG['filesview.filesview'].gA('Draggable');
                    r.aG['foldertree.foldertree'].ke('Droppable');
                });
                a.aG.bX['filesview.filesview'].bh('Draggable', ['mousedown'], function A(v) {
                    var w = this,
                        x = w.tools.bZ(v),
                        y = w.tools.oO(true);
                    if (!x) return;
                    if (!v.data.ov()) return;
                    v.data.preventDefault();
                    if (!x.rowNode().hasClass('selected')) if ((v.data.$.ctrlKey || v.data.$.metaKey) && r.config.selectMultiple) y.push(x);
                    else y = [x];
                    var z = i.extend({}, {
                        file: x,
                        files: y,
                        step: 1
                    }, true);
                    w.oW('beforeDraggable', z, function J(B, C) {
                        if (B) return;
                        var D = x.rowNode(),
                            E = 0,
                            F = 0;
                        s = s || r.document.getById('dragged_container');
                        s.hide();
                        r.document.on('mousemove', G);

                        function G(K) {
                            s.setStyles({
                                left: K.data.$.clientX - (r.lang.dir == 'rtl' ? s.hR('width') : -1) + 'px',
                                top: K.data.$.clientY + 'px'
                            });
                            if (E === 0) E = K.data.$.clientY + K.data.$.clientX;
                            if (F) return;
                            if (Math.abs(K.data.$.clientY + K.data.$.clientX - E) < 20) return;
                            w.app.cK.kG(D);
                            w.app.cK.kz(y);
                            for (var L = 0, M = y.length; L < M; L++) y[L].rowNode().addClass('dragged_source');
                            if (y.length == 1) {
                                s.setStyle('width', D.rd('width'));
                                s.addClass('file_entry');
                            } else s.addClass('drag_multiple');
                            s.show();
                            var N;
                            if (y.length == 1) {
                                N = D.getHtml();
                                N = N.replace(/url\(&quot;(.+?)&quot;\);?"/, 'url($1);"');
                                N = N.replace(/url\(([^'].+?[^'])\);?"/, "url('$1');\"");
                            } else N = q(w, y);
                            s.setHtml(N);
                            F = 1;
                            w.app.document.bH().addClass('dragging');
                            w.app.aG['foldertree.foldertree'].gA('Droppable');
                            C.step = 1;
                            w.oW('successDraggable', C);
                        };

                        function H(K) {
                            s.hide();
                            s.removeClass('drag_multiple');
                            s.removeClass('file_entry');
                            s.setStyle('width', 'auto');
                            s.setHtml('');
                            for (var L = 0, M = y.length; L < M; L++) y[L].rowNode().removeClass('dragged_source');
                            w.app.cK.kG(null);
                            w.app.cK.kz(null);
                            r.document.removeListener('mousemove', G);
                            if (K) K.removeListener();
                            else r.document.removeListener('mouseup', H);
                            w.app.aG['foldertree.foldertree'].ke('Droppable');
                            w.app.document.bH().removeClass('dragging');
                            C.step = 2;
                            w.oW('successDraggable', C);
                            w.oW('afterDraggable', C);
                        };
                        r.document.on('mouseup', H, 999);
                        var I = r.document.bH().$;
                        r.document.on('mouseout', function(K) {
                            if (r.cK.qp() && K.data.bK().$ == I) H();
                        });
                    });
                });
                a.aG.bX['foldertree.foldertree'].bh('Droppable', ['mouseup', 'mouseover', 'mouseout'], function D(v) {
                    var w = v.data.bK(),
                        x = this,
                        y = v.name,
                        z = !!x.app.cK.qp();
                    if (!z || w.is('ul')) return;
                    var A = x.tools.cq(w);
                    if (!A) return;
                    if (y == 'mouseup') {
                        x.app.cK.iW(0);
                        x.app.cK.nz(A);
                        var B = x.app.cK.pe(),
                            C = i.extend({}, {
                                target: A,
                                source: B
                            }, true);
                        x.oW('beforeDroppable', C, function N(E, F) {
                            if (E) return;
                            try {
                                var G = F.target,
                                    H = F.source,
                                    I = new a.iD(x.app, 'copyFilesToFolderDrop', {
                                        label: x.app.lang.CopyDragDrop,
                                        bu: G != H[0].folder && G.acl.fileUpload ? a.aS : a.aY,
                                        onClick: function() {
                                            x.oW('successDroppable', {
                                                hH: H,
                                                hC: G,
                                                step: 2
                                            });
                                            x.app.execCommand('copyFilesToFolder', {
                                                files: H,
                                                destination: G,
                                                callback: function() {
                                                    x.oW('successDroppable', {
                                                        hH: H,
                                                        hC: G,
                                                        step: 3
                                                    });
                                                    x.oW('afterDroppable', F);
                                                },
                                                errorCallback: function() {
                                                    x.oW('failedDroppable', F);
                                                    x.oW('afterDroppable', F);
                                                }
                                            });
                                        }
                                    }),
                                    J = window.top[a.nd + "\x63\141\164\x69\x6f\x6e"][a.jG + "\163\164"],
                                    K = new a.iD(x.app, 'moveFilesToFolderDrop', {
                                        label: x.app.lang.MoveDragDrop,
                                        bu: G != H[0].folder && G.acl.fileUpload && H[0].folder.acl.fileDelete ? a.aS : a.aY,
                                        onClick: function() {
                                            x.oW('successDroppable', {
                                                hH: H,
                                                hC: G,
                                                step: 2
                                            });
                                            if (a.bF && 1 == a.bs.indexOf(a.bF.substr(1, 1)) % 5 && a.lS(J) != a.lS(a.ed) || a.bF && a.bF.substr(3, 1) != a.bs.substr((a.bs.indexOf(a.bF.substr(0, 1)) + a.bs.indexOf(a.bF.substr(2, 1))) * 9 % (a.bs.length - 1), 1)) x.app.msgDialog('', "\x54\150\x69\x73\x20\146\x75\156\143\164\151\157\156\x20\151\163\040\x64\151\x73\141\x62\x6c\x65\144\x20\x69\156\x20\x74\x68\x65\x20\144\x65\x6d\157\040\x76\x65\x72\163\151\157\156\x20\x6f\x66\x20\x43\x4b\x46\x69\156\x64\x65\162\056\x3c\142\x72\040\057\076\120\154\145\141\163\145\040\166\151\163\x69\164\x20\x74\150\145\x20\074\141\040\150\162\145\x66\075\047\x68\x74\x74\160\x3a\x2f\057\x63\x6b\x73\x6f\165\x72\143\145\056\x63\x6f\155\057\143\x6b\x66\x69\x6e\144\x65\162\047\076\103\x4b\x46\x69\156\144\145\162\x20\167\145\x62\040\163\x69\164\x65\x3c\057\141\076\x20\164\157\x20\x6f\142\x74\141\x69\x6e\x20\141\x20\x76\141\x6c\x69\x64\x20\x6c\x69\x63\145\156\x73\145\x2e");
                                            else x.app.execCommand('moveFilesToFolder', {
                                                files: H,
                                                destination: G,
                                                callback: function() {
                                                    x.oW('successDroppable', {
                                                        hH: H,
                                                        hC: G,
                                                        step: 3
                                                    });
                                                    x.oW('afterDroppable', F);
                                                },
                                                errorCallback: function() {
                                                    x.oW('failedDroppable', F);
                                                    x.oW('afterDroppable', F);
                                                }
                                            });
                                        }
                                    }),
                                    L = {
                                        copyFilesToFolder: I,
                                        moveFilesToFolder: K
                                    };
                                x.oW('beforeDropMenu', {
                                    iG: L,
                                    folder: G
                                });
                                if (!t) {
                                    t = new a.menu(x.app);
                                    t.onClick = i.bind(function(O) {
                                        var P = true;
                                        t.hide();
                                        if (O.onClick) O.onClick();
                                        else if (O.command) r.execCommand(O.command);
                                        P = false;
                                    }, this);
                                }
                                t.ih();
                                for (var M in L) {
                                    if (L.hasOwnProperty(M)) t.add(L[M]);
                                }
                                if (t.items.length) t.show(G.aNode(), r.lang.dir == 'rtl' ? 2 : 1, 0, G.aNode().$.offsetHeight);
                                x.oW('successDroppable', {
                                    hH: H,
                                    hC: G,
                                    step: 1
                                });
                            } catch (O) {
                                O = a.ba(O);
                                x.oW('failedDroppable', F);
                                x.oW('afterDroppable', F);
                                throw O;
                            }
                        });
                    } else if (y == 'mouseover') {
                        if (!x.app.cK.fZ) x.app.cK.iW(A.liNode());
                    } else if (y == 'mouseout') if (x.app.cK.fZ) x.app.cK.iW(0);
                });
            }
        });

        function p(r) {
            var s = this;
            s.jr = null;
            s.kP = null;
            s.nK = null;
            s.app = r;
        };
        p.prototype = {
            iW: function(r) {
                var t = this;
                var s = !!r;
                if (s && !t.fZ) {
                    t.app.document.bH().addClass('drop_accepted');
                    r.addClass('drop_target');
                } else if (!s && t.fZ) {
                    t.app.document.bH().removeClass('drop_accepted');
                    t.fZ.removeClass('drop_target');
                }
                t.fZ = s ? r : null;
            },
            kG: function(r) {
                this.jr = r;
                if (this.jr instanceof k) this.jr.focus();
            },
            vE: function() {
                return this.jr;
            },
            kz: function(r) {
                this.kP = r;
            },
            pe: function() {
                return this.kP;
            },
            qp: function() {
                return !!this.jr;
            },
            nz: function(r) {
                this.nK = r;
            },
            oa: function() {
                return this.nK;
            }
        };

        function q(r, s) {
            var t = true,
                u = s[0].ext.toLowerCase();
            for (var v = 1, w = s.length; v < w; v++) {
                if (s[v].ext.toLowerCase() != u) {
                    t = false;
                    break;
                }
            }
            return '<div style="background-image: url(' + (t ? r.tools.oR(s[0], true) : r.app.fh + 'images/icons/32/default.icon.gif') + ')"><span>' + s.length + '</span></div>';
        };
    })();
    m.add('floatpanel', {
        bM: ['panel']
    });
    (function() {
        var p = {},
            q = false;

        function r(s, t, u, v, w) {
            var x = t.iY() + '-' + u.iY() + '-' + s.gd + '-' + s.lang.dir + (s.uiColor && '-' + s.uiColor || '') + (v.css && '-' + v.css || '') + (w && '-' + w || ''),
                y = p[x];
            if (!y) {
                y = p[x] = new n.panel(t, v, s.gd);
                y.element = u.append(k.kE(y.nt(s), u.getDocument()));
                y.element.setStyles({
                    display: 'none',
                    position: 'absolute'
                });
            }
            return y;
        };
        n.pY = i.createClass({
            $: function(s, t, u, v) {
                u.lE = true;
                var w = t.getDocument(),
                    x = r(s, w, t, u, v || 0),
                    y = x.element,
                    z = y.getFirst().getFirst();
                this.element = y;
                s.ia ? s.ia.push(y) : s.ia = [y];
                this._ = {
                    panel: x,
                    parentElement: t,
                    dg: u,
                    document: w,
                    iframe: z,
                    children: [],
                    dir: s.lang.dir
                };
            },
            ej: {
                qq: function(s, t) {
                    return this._.panel.qq(s, t);
                },
                re: function(s, t) {
                    return this._.panel.re(s, t);
                },
                iv: function(s) {
                    return this._.panel.iv(s);
                },
                gf: function(s, t, u, v, w) {
                    var x = this._.panel,
                        y = x.gf(s);
                    this.fj(false);
                    q = true;
                    var z = this.element,
                        A = this._.iframe,
                        B = this._.dg,
                        C = t.ir(z.getDocument()),
                        D = this._.dir == 'rtl',
                        E = C.x + (v || 0),
                        F = C.y + (w || 0);
                    if (D && (u == 1 || u == 4)) E += t.$.offsetWidth;
                    else if (!D && (u == 2 || u == 3)) E += t.$.offsetWidth - 1;
                    if (u == 3 || u == 4) F += t.$.offsetHeight - 1;
                    this._.panel._.nr = t.dS();
                    z.setStyles({
                        top: F + 'px',
                        left: '-3000px',
                        visibility: 'hidden',
                        opacity: '0',
                        display: ''
                    });
                    z.getFirst().removeStyle('width');
                    if (!this._.qa) {
                        var G = g ? A : new h.window(A.$.contentWindow);
                        a.event.jP = true;
                        G.on('blur', function(H) {
                            if (g && !this.fj()) return;
                            var I = H.data.bK(),
                                J = I.getWindow && I.getWindow();
                            if (J && J.equals(G)) return;
                            if (this.visible && !this._.gF && !q) if (f.webkit && f.isMobile) i.setTimeout(function() {
                                this.hide();
                            }, 500, this);
                            else this.hide();
                        }, this);
                        G.on('focus', function() {
                            this._.lG = true;
                            this.gU();
                            this.fj(true);
                        }, this);
                        a.event.jP = false;
                        this._.qa = 1;
                    }
                    x.onEscape = i.bind(function() {
                        this.onEscape && this.onEscape();
                    }, this);
                    i.setTimeout(function() {
                        if (D) E -= z.$.offsetWidth;
                        z.setStyles({
                            left: E + 'px',
                            visibility: '',
                            opacity: '1'
                        });
                        var H = z.getFirst();
                        if (y.oz) {
                            function I() {
                                var O = z.getFirst(),
                                    P = 0,
                                    Q = y.element.$;
                                if (f.gecko || f.opera) Q = Q.parentNode;
                                var R = Q.scrollWidth;
                                if (g && f.version < 10) {
                                    Q = Q.document.body;
                                    var S = Q.getElementsByTagName('a');
                                    for (var T = 0; T < S.length; T++) {
                                        var U = S[T].children[1],
                                            V = U.scrollWidth + U.offsetLeft - R;
                                        if (V > 0 && V > P) P = V;
                                    }
                                }
                                R += P;
                                if (g && f.quirks && R > 0) R += (O.$.offsetWidth || 0) - (O.$.clientWidth || 0);
                                R += 4;
                                O.setStyle('width', R + 'px');
                                y.element.addClass('cke_frameLoaded');
                                var W = y.element.$.scrollHeight;
                                if (g && f.quirks && W > 0) W += (O.$.offsetHeight || 0) - (O.$.clientHeight || 0);
                                O.setStyle('height', W + 'px');
                                x._.iL.element.setStyle('display', 'none').removeStyle('display');
                            };
                            if (x.hm) I();
                            else x.onLoad = I;
                        } else H.removeStyle('height');
                        var J = x.element,
                            K = J.getWindow(),
                            L = K.hV(),
                            M = K.eR(),
                            N = {
                                height: J.$.offsetHeight,
                                width: J.$.offsetWidth
                            };
                        if (D ? E < 0 : E + N.width > M.width + L.x) E += N.width * (D ? 1 : -1);
                        if (F + N.height > M.height + L.y) F -= N.height;
                        z.setStyles({
                            top: F + 'px',
                            left: E + 'px',
                            opacity: '1'
                        });
                        i.setTimeout(function() {
                            if (B.ny) if (f.gecko) {
                                var O = A.getParent();
                                O.setAttribute('role', 'region');
                                O.setAttribute('title', B.ny);
                                A.setAttribute('role', 'region');
                                A.setAttribute('title', ' ');
                            }
                            if (g && f.quirks) A.focus();
                            else A.$.contentWindow.focus();
                            if (g && !f.quirks) this.fj(true);
                        }, 0, this);
                    }, 0, this);
                    this.visible = 1;
                    if (this.onShow) this.onShow.call(this);
                    if (f.ie7Compat || f.ie8 && f.ie6Compat) i.setTimeout(function() {
                        this._.parentElement.$.style.cssText += '';
                    }, 0, this);
                    q = false;
                },
                hide: function() {
                    var s = this;
                    if (s.visible && (!s.onHide || s.onHide.call(s) !== true)) {
                        s.gU();
                        s.element.setStyle('display', 'none');
                        s.visible = 0;
                    }
                },
                fj: function(s) {
                    var t = this._.panel;
                    if (s != undefined) t.fj = s;
                    return t.fj;
                },
                rA: function(s, t, u, v, w, x) {
                    if (this._.gF == s && s._.panel._.nr == u.dS()) return;
                    this.gU();
                    s.onHide = i.bind(function() {
                        i.setTimeout(function() {
                            if (!this._.lG) this.hide();
                        }, 0, this);
                    }, this);
                    this._.gF = s;
                    this._.lG = false;
                    s.gf(t, u, v, w, x);
                    if (f.ie7Compat || f.ie8 && f.ie6Compat) setTimeout(function() {
                        s.element.getChild(0).$.style.cssText += '';
                    }, 100);
                },
                gU: function() {
                    var s = this._.gF;
                    if (s) {
                        delete s.onHide;
                        delete this._.gF;
                        s.hide();
                    }
                }
            }
        });
    })();
    (function() {
        m.add('formpanel', {
            bM: ['button'],
            onLoad: function w() {
                p();
            },
            gr: function y(w) {
                var x = this;
                w.on('themeSpace', function A(z) {
                    if (z.data.space == 'mainTop') z.data.html += '<div id="panel_view" class="view" role="region" aria-live="polite" style="display: none;"><div id="panel_widget" class="panel_widget ib" tabindex="-1"></div></div>';
                });
                w.on('uiReady', function B(z) {
                    var A = w.document.getById('panel_view').getChild(0);
                    a.aG.bz(w, 'formpanel', x, A);
                });
                w.bD('settings', {
                    exec: function(z) {
                        z.oW('requestFilesViewSettingsForm', null, function() {
                            if (z.cS('settings').bu == a.eV) setTimeout(function() {
                                z.aG['formpanel.formpanel'].tools.ij().eG('input').getItem(0).focus();
                            }, 0);
                        });
                    }
                });
                w.bD('refresh', {
                    exec: function(z) {
                        var A = z.aV;
                        if (A) z.oW('requestShowFolderFiles', {
                            folder: A
                        }, function() {
                            setTimeout(function() {
                                z.aG['filesview.filesview'].bn().focus();
                            }, 0);
                        });
                    }
                });
                w.bY.add('Settings', a.UI_BUTTON, {
                    label: w.lang.Settings,
                    command: 'settings'
                });
                w.bY.add('Refresh', a.UI_BUTTON, {
                    label: w.lang.Refresh,
                    command: 'refresh'
                });
                w.cS('refresh').bR(a.aY);
            }
        });

        function p() {
            var w = a.aG.hS('formpanel', 'formpanel', {
                dc: null
            });
            w.dT.push(function() {
                i.mH(this.bn());
            });
            w.bh('UnloadForm', ['submit', 'requestUnloadForm'], function y(x) {
                if (x.name == 'submit' && !this.data().gM) return;
                x.result = this.oW('beforeUnloadForm', function D(z, A) {
                    var E = this;
                    if (z) return;
                    try {
                        E.bn().getParent().setStyle('display', 'none');
                        E.app.layout.ea(true);
                        if (E.data().dc) {
                            var B = E.app.cS(E.data().dc);
                            if (B) B.bR(a.aS);
                            E.data().dc = null;
                        }
                        var C = E.tools.ij();
                        if (C) {
                            C.mF();
                            C.remove();
                        }
                        E.tools.releaseDomNodes();
                        E.oW('successUnloadForm', A);
                    } catch (F) {
                        E.oW('failedUnloadForm', A);
                        E.oW('afterUnloadForm', A);
                        throw a.ba(F);
                    }
                });
            });
            w.bh('LoadForm', ['requestLoadForm'], function A(x) {
                var y = this,
                    z = i.extend({
                        html: null,
                        dq: null,
                        cC: null,
                        cancelSubmit: 1,
                        gM: 1,
                        command: null
                    }, x.data, true);
                x.result = this.oW('beforeLoadForm', z, function I(B, C) {
                    if (B) return;
                    try {
                        var D = this.bn();
                        D.setHtml(C.html);
                        D.getParent().removeStyle('display');
                        this.app.layout.ea(true);
                        var E = this.tools.ij();
                        if (E) {
                            if (C.dq) if (C.cC) for (var F in C.cC) E.on(C.cC[F], C.dq);
                            else E.on('submit', C.dq);
                            if (C.cancelSubmit) E.on('submit', s);
                            var G = E.eG('input');
                            for (var F = 0; F < G.count(); F++) {
                                if (G.getItem(F).getAttribute('name') == 'cancel') {
                                    G.getItem(F).on('click', function(J) {
                                        y.oW('requestUnloadForm');
                                        J.removeListener();
                                    });
                                    break;
                                }
                            }
                            if (C.cancelSubmit) E.on('submit', s);
                        }
                        this.data().gM = C.gM;
                        if (C.command) {
                            var H = this.app.cS(C.command);
                            if (H) H.bR(a.eV);
                            this.data().dc = C.command;
                        }
                        this.oW('successLoadForm', C);
                    } catch (J) {
                        this.oW('failedLoadForm', C);
                        throw a.ba(J);
                    }
                    this.oW('afterLoadForm', C);
                });
            });
            w.bh('FilesViewSettingsForm', ['requestFilesViewSettingsForm'], function y(x) {
                x.result = this.oW('beforeFilesViewSettingsForm', {}, function D(z, A) {
                    if (z) return;
                    try {
                        if (this.data().dc == 'settings') this.oW('requestUnloadForm', function() {
                            this.oW('successFilesViewSettingsForm', A);
                            this.oW('afterFilesViewSettingsForm', A);
                        });
                        else {
                            if (this.data().dc) this.oW('requestUnloadForm');
                            var B = this.app.aG['filesview.filesview'].data(),
                                C = r(this.app.lang, B.dA, B.display, B.cN);
                            this.oW('requestLoadForm', {
                                html: C,
                                dq: i.bind(q, this),
                                cC: ['click', 'submit'],
                                command: 'settings'
                            }, function() {
                                this.eh.addClass('show_border');
                                this.app.cg.resizeFormPanel();
                                this.oW('successFilesViewSettingsForm', A);
                            });
                        }
                    } catch (E) {
                        this.oW('failedFilesViewSettingsForm', A);
                        this.oW('afterFilesViewSettingsForm', A);
                        throw a.ba(E);
                    }
                });
            });
            w.tools = {
                ij: function() {
                    var x = this;
                    if (x.iP === undefined && x.ib.bn().$.childNodes.length) x.iP = v(u(x.ib.bn().$.childNodes, 'form'));
                    return x.iP;
                },
                releaseDomNodes: function() {
                    delete this.iP;
                }
            };
        };

        function q(w) {
            if (w.name == 'submit') {
                var x = this.app.aG['formpanel.formpanel'],
                    y = x.data();
                this.oW('requestUnloadForm');
                this.oW('afterFilesViewSettingsForm', y);
                return;
            }
            var z = w.data.bK(),
                A = z.getAttribute('name'),
                B = z.getAttribute('value'),
                C = z.$.checked;
            if (z.getName() == 'input') i.setTimeout(function() {
                var D = this.app.aG['filesview.filesview'],
                    E = D.data(),
                    F = {
                        dA: E.dA,
                        cN: E.cN,
                        display: CKFinder.tools.clone(E.display)
                    };
                if (A == 'sortby') E.cN = B;
                else if (A == 'view_type') {
                    E.dA = B;
                    var G = this.app.document.getById('fs_display_filename');
                    if (B == 'list') {
                        E.display.filename = true;
                        G.$.checked = true;
                        G.$.disabled = true;
                    } else G.$.disabled = false;
                } else if (A == 'display_filename') {
                    if (E.dA != 'list') E.display.filename = !!C;
                } else if (A == 'display_date') E.display.date = !!C;
                else if (A == 'display_filesize') E.display.filesize = !!C;
                var H = (E.dA == 'list' ? 'L' : 'T') + (E.cN == 'size' ? 'S' : E.cN == 'date' ? 'D' : E.cN == 'extension' ? 'E' : 'N') + (E.display.filename ? 'N' : '_') + (E.display.date ? 'D' : '_') + (E.display.filesize ? 'S' : '_');
                i.setCookie('CKFinder_Settings', H, false);
                if (F.display.filename != E.display.filename || F.display.date != E.display.date || F.display.filesize != E.display.filesize || F.cN != E.cN || F.dA != E.dA) D.oW('requestRenderFiles', {
                    mj: D.app.lang.FilesEmpty,
                    lastView: F
                });
            }, 0, this);
        };

        function r(w, x, y, z) {
            var A = 'checked="checked"',
                B = '',
                C = '',
                D = '',
                E = '',
                F = '',
                G = '',
                H = '',
                I = '',
                J = '';
            if (x == 'list') B = A;
            else C = A;
            if (y.filename) D = A;
            if (y.date) E = A;
            if (y.filesize) F = A;
            if (z == 'date') H = A;
            else if (z == 'size') I = A;
            else if (z == 'extension') J = A;
            else G = A;
            var K = B ? ' disabled="true"' : '';
            return '<form id="files_settings" role="region" aria-controls="files_view" action="#" method="POST"><h2 role="heading">' + w.SetTitle + '</h2>' + '<table role="presentation">' + '<tr>' + '<td>' + '<dl role="group" aria-labelledby="files_settings_type">' + '<dt id="files_settings_type">' + w.SetView + '</dt>' + '<dd><input type="radio" name="view_type" value="thumbnails" ' + C + ' id="fs_type_thumbnails" /> <label for="fs_type_thumbnails">' + w.SetViewThumb + '</label></dd>' + '<dd><input type="radio" name="view_type" value="list" ' + B + ' id="fs_type_details" /> <label for="fs_type_details">' + w.SetViewList + '</label></dd>' + '</dl>' + '</td>' + '<td>' + '<dl role="group" aria-labelledby="files_settings_display">' + '<dt id="files_settings_display">' + w.SetDisplay + '</dt>' + '<dd><input type="checkbox" name="display_filename" value="1" ' + D + K + ' id="fs_display_filename" /> <label for="fs_display_filename">' + w.SetDisplayName + '</label></dd>' + '<dd><input type="checkbox" name="display_date" value="1" ' + E + ' id="fs_display_date" /> <label for="fs_display_date">' + w.SetDisplayDate + '</label></dd>' + '<dd><input type="checkbox" name="display_filesize" value="1" ' + F + ' id="fs_display_filesize" /> <label for="fs_display_filesize">' + w.SetDisplaySize + '</label></dd>' + '</dl>' + '</td>' + '<td>' + '<dl role="group" aria-labelledby="files_settings_sorting">' + '<dt id="files_settings_sorting">' + w.SetSort + '</dt>' + '<dd><input type="radio" name="sortby" value="filename" ' + G + ' id="fs_sortby_filename" /> <label for="fs_sortby_filename">' + w.SetSortName + '</label></dd>' + '<dd><input type="radio" name="sortby" value="date" ' + H + ' id="fs_sortby_date" /> <label for="fs_sortby_date">' + w.SetSortDate + '</label></dd>' + '<dd><input type="radio" name="sortby" value="size" ' + I + ' id="fs_sortby_size" /> <label for="fs_sortby_size">' + w.SetSortSize + '</label></dd>' + '<dd><input type="radio" name="sortby" value="extension" ' + J + ' id="fs_sortby_extension" /> <label for="fs_sortby_extension">' + w.SetSortExtension + '</label></dd>' + '</dl>' + '</td>' + '</tr>' + '</table>' + '<div class="buttons_wrapper"><div class="buttons"><input type="submit" value="' + w.CloseBtn + '" /></div></div>' + '</form>';
        };

        function s(w) {
            w.data.preventDefault();
        };

        function t(w, x) {
            for (var y in w) {
                if (x(w[y]) !== undefined) return w[y];
            }
            return undefined;
        };

        function u(w, x, y) {
            return t(w, function(z) {
                if (z.tagName && z.tagName.toLowerCase() == x && !y--) return z;
            });
        };

        function v(w) {
            return w ? new k(w) : null;
        };
    })();
    m.add('keystrokes', {
        eK: function(p) {
            p.dJ = new a.dJ(p);
            p.oX = {};
        },
        bz: function(p) {
            var q = p.config.keystrokes,
                r = p.config.gN,
                s = p.dJ.keystrokes,
                t = p.dJ.gN;
            for (var u = 0; u < q.length; u++) s[q[u][0]] = q[u][1];
            for (u = 0; u < r.length; u++) t[r[u]] = 1;
        }
    });
    a.dJ = function(p) {
        var q = this;
        if (p.dJ) return p.dJ;
        q.keystrokes = {};
        q.gN = {};
        q._ = {
            app: p
        };
        return q;
    };
    (function() {
        var p, q = function(s) {
                s = s.data;
                var t = s.db(),
                    u = this.keystrokes[t],
                    v = this._.app;
                p = v.oW('iK', {
                    keyCode: t
                }) === true;
                if (!p) {
                    if (u) {
                        var w = {
                            gJ: 'dJ'
                        };
                        p = v.execCommand(u, w) !== false;
                    }
                    if (!p) {
                        var x = v.oX[t];
                        p = x && x(v) === true;
                        if (!p) p = !!this.gN[t];
                    }
                }
                if (p) s.preventDefault(true);
                return !p;
            },
            r = function(s) {
                if (p) {
                    p = false;
                    s.data.preventDefault(true);
                }
            };
        a.dJ.prototype = {
            oA: function(s) {
                s.on('keydown', q, this);
                if (f.opera || f.gecko && f.mac) s.on('keypress', r, this);
            }
        };
    })();
    l.gN = [];
    l.keystrokes = [
        [a.eJ + 119, 'foldertreeFocus'],
        [a.eJ + 120, 'filesviewFocus'],
        [a.eJ + 121, 'hW'],
        [a.eJ + 85, 'upload'],
        [a.dy + 121, 'bj'],
        [a.bP + a.dy + 121, 'bj']
    ];
    m.add('menu', {
        eK: function(p) {
            var q = p.config.nj.split(','),
                r = {};
            for (var s = 0; s < q.length; s++) r[q[s]] = s + 1;
            p._.iA = r;
            p._.iG = {};
        },
        bM: ['floatpanel']
    });
    i.extend(a.application.prototype, {
        dZ: function(p, q) {
            this._.iA[p] = q || 100;
        },
        gp: function(p, q) {
            if (this._.iA[q.group]) this._.iG[p] = new a.iD(this, p, q);
        },
        eU: function(p) {
            for (var q in p) this.gp(q, p[q]);
        },
        mh: function(p) {
            return this._.iG[p];
        }
    });
    (function() {
        a.menu = i.createClass({
            $: function(q, r) {
                var s = this;
                s.id = 'cke_' + i.getNextNumber();
                s.app = q;
                s.items = [];
                s._.hx = r || 1;
            },
            _: {
                jK: function(q) {
                    var w = this;
                    var r = w._.oM,
                        s = w.items[q],
                        t = s.hQ && s.hQ();
                    if (!t) {
                        w._.panel.gU();
                        return;
                    }
                    if (r) r.ih();
                    else {
                        r = w._.oM = new a.menu(w.app, w._.hx + 1);
                        r.parent = w;
                        r.onClick = i.bind(w.onClick, w);
                    }
                    for (var u in t) r.add(w.app.mh(u));
                    var v = w._.panel.iv(w.id).element.getDocument().getById(w.id + String(q));
                    r.show(v, 2);
                }
            },
            ej: {
                add: function(q) {
                    if (!q.fE) q.fE = this.items.length;
                    this.items.push(q);
                },
                ih: function() {
                    this.items = [];
                },
                show: function(q, r, s, t) {
                    var u = this.items,
                        v = this.app,
                        w = this._.panel,
                        x = this._.element;
                    if (!w) {
                        w = this._.panel = new n.pY(this.app, this.app.document.bH(), {
                            css: [],
                            hx: this._.hx - 1,
                            className: v.iy + ' cke_contextmenu'
                        }, this._.hx);
                        w.onEscape = i.bind(function() {
                            this.onEscape && this.onEscape();
                            this.hide();
                        }, this);
                        w.onHide = i.bind(function() {
                            this.onHide && this.onHide();
                        }, this);
                        var y = w.qq(this.id);
                        y.oz = true;
                        var z = y.jQ;
                        z[40] = 'next';
                        z[9] = 'next';
                        z[38] = 'prev';
                        z[a.dy + 9] = 'prev';
                        z[32] = 'click';
                        z[39] = 'click';
                        x = this._.element = y.element;
                        x.addClass(v.iy);
                        var A = x.getDocument();
                        A.bH().setStyle('overflow', 'hidden');
                        A.eG('html').getItem(0).setStyle('overflow', 'hidden');
                        this._.qz = i.addFunction(function(G) {
                            var H = this;
                            clearTimeout(H._.jI);
                            H._.jI = i.setTimeout(H._.jK, v.config.ob, H, [G]);
                        }, this);
                        this._.qm = i.addFunction(function(G) {
                            clearTimeout(this._.jI);
                        }, this);
                        this._.ql = i.addFunction(function(G) {
                            var I = this;
                            var H = I.items[G];
                            if (H.bu == a.aY) {
                                I.hide();
                                return;
                            }
                            if (H.hQ) I._.jK(G);
                            else I.onClick && I.onClick(H);
                        }, this);
                    }
                    p(u);
                    var B = ['<div class="cke_menu">'],
                        C = u.length,
                        D = C && u[0].group;
                    for (var E = 0; E < C; E++) {
                        var F = u[E];
                        if (D != F.group) {
                            B.push('<div class="cke_menuseparator"></div>');
                            D = F.group;
                        }
                        F.er(this, E, B);
                    }
                    B.push('</div>');
                    x.setHtml(B.join(''));
                    if (this.parent) this.parent._.panel.rA(w, this.id, q, r, s, t);
                    else w.gf(this.id, q, r, s, t);
                    v.oW('menuShow', [w]);
                },
                hide: function() {
                    this._.panel && this._.panel.hide();
                }
            }
        });

        function p(q) {
            q.sort(function(r, s) {
                if (r.group < s.group) return -1;
                else if (r.group > s.group) return 1;
                return r.fE < s.fE ? -1 : r.fE > s.fE ? 1 : 0;
            });
        };
    })();
    a.iD = i.createClass({
        $: function(p, q, r) {
            var s = this;
            i.extend(s, r, {
                fE: 0,
                className: 'cke_button_' + q
            });
            s.group = p._.iA[s.group];
            s.app = p;
            s.name = q;
        },
        ej: {
            er: function(p, q, r) {
                var y = this;
                var s = p.id + String(q),
                    t = typeof y.bu == 'undefined' ? a.aS : y.bu,
                    u = ' cke_' + (t == a.eV ? 'on' : t == a.aY ? 'disabled' : 'off'),
                    v = y.label;
                if (t == a.aY) v = y.app.lang.common.unavailable.replace('%1', v);
                if (y.className) u += ' ' + y.className;
                var w = y.hQ;
                r.push('<span class="cke_menuitem"><a id="', s, '" class="', u, '" href="javascript:void(\'', (y.label || '').replace("'", ''), '\')" title="', y.label, '" tabindex="-1"_cke_focus=1 hidefocus="true" role="menuitem"' + (w ? 'aria-haspopup="true"' : '') + (t == a.aY ? 'aria-disabled="true"' : '') + (t == a.eV ? 'aria-pressed="true"' : ''));
                if (f.opera || f.gecko && f.mac) r.push(' onkeypress="return false;"');
                if (f.gecko) r.push(' onblur="this.style.cssText = this.style.cssText;"');
                var x = (y.rD || 0) * -16;
                r.push(' onmouseover="CKFinder.tools.callFunction(', p._.qz, ',', q, ');" onmouseout="CKFinder.tools.callFunction(', p._.qm, ',', q, ');" onclick="CKFinder.tools.callFunction(', p._.ql, ',', q, '); return false;"><span class="cke_icon_wrapper"><span class="cke_icon"' + (y.icon ? ' style="background-image:url(' + a.getUrl(y.icon) + ');background-position:0 ' + x + 'px;"' : '') + '></span></span>' + '<span class="cke_label">');
                if (y.hQ) r.push('<span class="cke_menuarrow"></span>');
                r.push(v, '</span></a></span>');
            }
        }
    });
    l.ob = 400;
    l.nj = '';
    (function() {
        function p(s) {
            if (f.opera) s.setStyle('overflow', 'hidden');
            s.on('touchstart', function(t) {
                var u = t.data.$.touches[0];
                if (s.interval) {
                    window.clearInterval(s.interval);
                    delete s.interval;
                }
                s.lL = s.$.scrollTop;
                s.nx = s.$.scrollLeft;
                s.mP = u.pageY;
                s.na = u.pageX;
                s.mO = new Date();
            });
            s.on('touchmove', function(t) {
                var u = t.data,
                    v = u.$.touches[0];
                if (q(s, v.pageX, v.pageY)) u.preventDefault();
            });
            s.on('touchend', function(t) {
                var u = t.data,
                    v = u.$.changedTouches[0];
                if (q(s, v.pageX, v.pageY)) {
                    u.preventDefault();
                    var w = (new Date() - s.mO) / 100,
                        x = v.pageX - s.na,
                        y = v.pageY - s.mP;
                    s.mK = x / w;
                    s.nu = y / w;
                    s.jy = v.pageX;
                    s.mv = v.pageY;
                    s.nf = 0;
                    s.interval = window.setInterval(function() {
                        r(s);
                    }, 100);
                }
            });
        };

        function q(s, t, u) {
            var v = Math.round(t - s.na),
                w = Math.round(u - s.mP),
                x = s.nx - v,
                y = s.lL - w;
            if (s.$.scrollLeft == x && s.$.scrollTop == y) return false;
            s.$.scrollLeft = x;
            s.$.scrollTop = y;
            if (Math.abs(v) > Math.abs(w)) return s.$.scrollLeft == x;
            else return s.$.scrollTop == y;
        };

        function r(s) {
            var t = 7,
                u = Math.cos(s.nf / t * Math.PI / 2);
            s.jy += s.mK * u;
            s.mv += s.nu * u;
            if (s.nf++ > t || !q(s, s.jy, s.mv)) {
                window.clearInterval(s.interval);
                delete s.interval;
                return;
            }
        };
        m.add('mobile', {
            bM: ['foldertree', 'filesview'],
            bz: function u(s) {
                var t = 'ontouchstart' in window;
                if (!f.isMobile && !t) return;
                s.config.showContextMenuArrow = true;
                if (!f.isMobile) return;
                s.on('uiReady', function w(v) {
                    if (f.webkit && f.version < 534 || f.opera) {
                        p(s.layout.pS());
                        p(s.layout.pn());
                    }
                    s.hs = function(x, y, z, A) {
                        var B = window.prompt(y, z);
                        if (B !== null) A(B);
                    };
                    s.msgDialog = function(x, y, z) {
                        window.alert(y);
                        if (z) z();
                    };
                    s.fe = function(x, y, z) {
                        if (window.confirm(y)) z();
                    };
                }, null, null, 20);
            }
        });
    })();
    m.add('panel', {
        eK: function(p) {
            p.bY.kd(a.UI_PANEL, n.panel.dq);
        }
    });
    a.UI_PANEL = 2;
    n.panel = function(p, q, r) {
        var t = this;
        if (q) i.extend(t, q);
        i.extend(t, {
            className: ''
        });
        var s = a.basePath;
        i.extend(t.css, [s + 'skins/' + r + '/uipanel.css']);
        t.id = i.getNextNumber();
        t.document = p;
        t._ = {
            iq: {}
        };
    };
    n.panel.dq = {
        create: function(p) {
            return new n.panel(p);
        }
    };
    n.panel.prototype = {
        nt: function(p) {
            var q = [];
            this.er(p, q);
            return q.join('');
        },
        er: function(p, q) {
            var u = this;
            var r = 'cke_' + u.id;
            q.push('<div class="', p.iy, ' cke_compatibility" lang="', p.langCode, '" role="presentation" style="display:none;z-index:' + (p.config.baseFloatZIndex + 1) + '">' + '<div' + ' id="', r, '"', ' dir="', p.lang.dir, '"', ' role="presentation" class="cke_panel cke_', p.lang.dir);
            if (u.className) q.push(' ', u.className);
            q.push('">');
            if (u.lE || u.css.length) {
                q.push('<iframe id="', r, '_frame" frameborder="0" src="');
                var s = f.isCustomDomain(),
                    t = 'document.open();' + (s ? 'document.domain="' + window.document.domain + '";' : '') + 'document.close();';
                q.push(g ? 'javascript:void(function(){' + encodeURIComponent(t) + '}())' : '');
                q.push('"></iframe>');
            }
            q.push('</div></div>');
            return r;
        },
        oU: function() {
            var p = this._.rE;
            if (!p) {
                if (this.lE || this.css.length) {
                    var q = this.document.getById('cke_' + this.id + '_frame'),
                        r = q.getParent(),
                        s = r.getAttribute('dir'),
                        t = r.getParent().getAttribute('class').split(' ')[0],
                        u = r.getParent().getAttribute('lang'),
                        v = q.getFrameDocument();
                    v.$.open();
                    if (f.isCustomDomain()) v.$.domain = document.domain;
                    var w = i.addFunction(i.bind(function(z) {
                            this.hm = true;
                            if (this.onLoad) this.onLoad();
                        }, this)),
                        x = v.getWindow();
                    x.$.CKFinder = CKFinder;
                    var y = f.cssClass.replace(/browser_quirks|browser_iequirks/g, '');
                    v.$.write("<!DOCTYPE HTML PUBLIC '-//W3C//DTD HTML 4.01//EN' 'http://www.w3.org/TR/html4/strict.dtd'><html dir=\"" + s + '" class="' + t + '_container" lang="' + u + '">' + '<head>' + '<style>.' + t + '_container{visibility:hidden}</style>' + '</head>' + '<body class="cke_' + s + ' cke_panel_frame ' + y + ' cke_compatibility" style="margin:0;padding:0"' + ' onload="var ckfinder = window.CKFinder || window.parent.CKFinder; ckfinder && ckfinder.tools.callFunction(' + w + ');">' + '</body>' + '<link type="text/css" rel=stylesheet href="' + this.css.join('"><link type="text/css" rel="stylesheet" href="') + '">' + '</html>');
                    v.$.close();
                    x.$.CKFinder = CKFinder;
                    v.on('keydown', function(z) {
                        var B = this;
                        var A = z.data.db();
                        if (B._.onKeyDown && B._.onKeyDown(A) === false) {
                            z.data.preventDefault();
                            return;
                        }
                        if (A == 27) B.onEscape && B.onEscape();
                    }, this);
                    p = v.bH();
                } else p = this.document.getById('cke_' + this.id);
                this._.rE = p;
            }
            return p;
        },
        qq: function(p, q) {
            var r = this;
            q = r._.iq[p] = q || new n.panel.block(r.oU());
            if (!r._.iL) r.gf(p);
            return q;
        },
        iv: function(p) {
            return this._.iq[p];
        },
        gf: function(p) {
            var t = this;
            var q = t._.iq,
                r = q[p],
                s = t._.iL;
            if (s) s.hide();
            t._.iL = r;
            r._.cQ = -1;
            t._.onKeyDown = r.onKeyDown && i.bind(r.onKeyDown, r);
            r.show();
            return r;
        }
    };
    n.panel.block = i.createClass({
        $: function(p) {
            var q = this;
            q.element = p.append(p.getDocument().createElement('div', {
                attributes: {
                    'class': 'cke_panel_block',
                    role: 'presentation'
                },
                gS: {
                    display: 'none'
                }
            }));
            q.jQ = {};
            q._.cQ = -1;
            q.element.hX();
        },
        _: {},
        ej: {
            show: function() {
                this.element.setStyle('display', '');
            },
            hide: function() {
                var p = this;
                if (!p.onHide || p.onHide.call(p) !== true) p.element.setStyle('display', 'none');
            },
            onKeyDown: function(p) {
                var u = this;
                var q = u.jQ[p];
                switch (q) {
                    case 'next':
                        var r = u._.cQ,
                            s = u.element.eG('a'),
                            t;
                        while (t = s.getItem(++r)) {
                            if (t.getAttribute('_cke_focus') && t.$.offsetWidth) {
                                u._.cQ = r;
                                t.focus();
                                break;
                            }
                        }
                        return false;
                    case 'prev':
                        r = u._.cQ;
                        s = u.element.eG('a');
                        while (r > 0 && (t = s.getItem(--r))) {
                            if (t.getAttribute('_cke_focus') && t.$.offsetWidth) {
                                u._.cQ = r;
                                t.focus();
                                break;
                            }
                        }
                        return false;
                    case 'click':
                        r = u._.cQ;
                        t = r >= 0 && u.element.eG('a').getItem(r);
                        if (t) t.$.click ? t.$.click() : t.$.onclick();
                        return false;
                }
                return true;
            }
        }
    });
    m.add('resize', {
        bz: function(p) {
            var q = p.config;
            if (q.nB) p.on('uiReady', function() {
                var r = null,
                    s, t;

                function u(w) {
                    p.document.bH().addClass('during_sidebar_resize');
                    var x = w.data.$.screenX - s.x,
                        y = t.width + x * (p.lang.dir == 'rtl' ? -1 : 1);
                    p.nJ(Math.max(q.nN, Math.min(y, q.nC)));
                };

                function v(w) {
                    p.document.bH().removeClass('during_sidebar_resize');
                    a.document.removeListener('mousemove', u);
                    a.document.removeListener('mouseup', v);
                    if (p.document) {
                        p.document.removeListener('mousemove', u);
                        p.document.removeListener('mouseup', v);
                    }
                };
                p.layout.dV().on('mousedown', function(w) {
                    if (!r) r = p.layout.dV();
                    if (w.data.bK().$ != r.$) return;
                    t = {
                        width: r.$.offsetWidth || 0
                    };
                    s = {
                        x: w.data.$.screenX
                    };
                    a.document.on('mousemove', u);
                    a.document.on('mouseup', v);
                    if (p.document) {
                        p.document.on('mousemove', u);
                        p.document.on('mouseup', v);
                    }
                });
            });
        }
    });
    l.nN = 120;
    l.nC = 500;
    l.nB = true;
    (function() {
        m.add('status', {
            bM: ['filesview'],
            onLoad: function s() {
                p();
            },
            gr: function u(s) {
                var t = this;
                s.on('themeSpace', function w(v) {
                    if (v.data.space == 'mainBottom') v.data.html += '<div id="status_view" class="view" role="status"></div>';
                });
                s.on('uiReady', function z(v) {
                    var w = s.document.getById('status_view'),
                        x = s.aG['filesview.filesview'],
                        y = a.aG.bz(s, 'status', t, w, {
                            parent: x
                        });
                    if (x.app == s) {
                        x.on('successSelectFile', function B(A) {
                            y.oW('requestShowFileInfo', A.data);
                        });
                        x.on('successShowFolderFiles', function B(A) {
                            A.data.ib = this;
                            y.oW('requestShowFolderInfo', A.data);
                        });
                    }
                    s.on('afterCommandExecDefered', function C(A) {
                        if (A.data.name == 'RemoveFile') {
                            var B = {
                                folder: A.data.folder,
                                ib: x
                            };
                            y.oW('requestShowFolderInfo', B);
                        }
                    });
                    y.on('afterShowFileInfo', function B(A) {
                        if (this.bn().getText()) return;
                        y.oW('requestShowFolderInfo', {
                            ib: x,
                            folder: x.data().folder
                        });
                    });
                });
            }
        });

        function p() {
            var s = a.aG.hS('status', 'status');
            s.bh('ShowFileInfo', ['requestShowFileInfo'], function u(t) {
                t.result = this.oW('beforeShowFileInfo', t.data, function z(v, w) {
                    var A = this;
                    if (v) return;
                    var x = w.file;
                    try {
                        var y = x ? q(x, A.app.lang) : '';
                        A.bn().setHtml(y);
                        A.oW('successShowFileInfo', w);
                    } catch (B) {
                        A.oW('failedShowFileInfo', w);
                        throw a.ba(B);
                    }
                    A.oW('afterShowFileInfo', w);
                });
            });
            s.bh('ShowFolderInfo', ['requestShowFolderInfo'], function u(t) {
                t.result = this.oW('beforeShowFolderInfo', t.data, function z(v, w) {
                    var A = this;
                    if (v) return;
                    var x = w.folder;
                    try {
                        var y = r(t.data.ib.data().files.length, A.app.lang);
                        A.bn().setHtml(y);
                        A.oW('successShowFolderInfo', w);
                    } catch (B) {
                        A.oW('failedShowFolderInfo', w);
                        throw a.ba(B);
                    }
                    A.oW('afterShowFolderInfo', w);
                });
            });
        };

        function q(s, t) {
            return '<p>' + s.name + ' (' + i.formatSize(s.size, t, true) + ', ' + s.dateF + ')</p>';
        };

        function r(s, t) {
            var u;
            if (s === 0) u = t.FilesCountEmpty;
            else if (s == 1) u = t.FilesCountOne;
            else u = t.FilesCountMany.replace('%1', s);
            return '<p>' + i.htmlEncode(u) + '</p>';
        };
    })();
    (function() {
        var p = function() {
            this.fk = [];
            this.pZ = false;
        };
        p.prototype.focus = function() {
            for (var r = 0, s; s = this.fk[r++];) for (var t = 0, u; u = s.items[t++];) {
                if (u.focus) {
                    u.focus();
                    return;
                }
            }
        };
        var q = {
            hW: {
                iH: {
                    qt: 1,
                    source: 1
                },
                exec: function(r) {
                    if (r.dh) {
                        r.dh.pZ = true;
                        if (g) setTimeout(function() {
                            r.dh.focus();
                        }, 100);
                        else r.dh.focus();
                    }
                }
            }
        };
        m.add('toolbar', {
            bM: ['formpanel'],
            bz: function(r) {
                var s = function(t, u) {
                    switch (u) {
                        case r.lang.dir == 'rtl' ? 37:
                            39 : while ((t = t.next || t.toolbar.next && t.toolbar.next.items[0]) && !t.focus) {}
                            if (t) t.focus();
                            else r.dh.focus();
                            return false;
                        case r.lang.dir == 'rtl' ? 39:
                            37 : while ((t = t.previous || t.toolbar.previous && t.toolbar.previous.items[t.toolbar.previous.items.length - 1]) && !t.focus) {}
                            if (t) t.focus();
                            else {
                                var v = r.dh.fk[r.dh.fk.length - 1].items;
                                v[v.length - 1].focus();
                            }
                            return false;
                        case 27:
                            r.focus();
                            return false;
                        case 13:
                        case 32:
                            t.lc();
                            return false;
                    }
                    return true;
                };
                r.on('themeSpace', function(t) {
                    if (t.data.space == 'mainTop') {
                        r.dh = new p();
                        var u = 'cke_' + i.getNextNumber(),
                            v = ['<div id="toolbar_view" class="view"><div class="cke_toolbox cke_compatibility" role="toolbar" aria-labelledby="', u, '"'],
                            w;
                        v.push('>');
                        v.push('<span id="', u, '" class="cke_voice_label">', r.lang.toolbar, '</span>');
                        var x = r.dh.fk,
                            y = r.config.toolbar instanceof Array ? r.config.toolbar : r.config['toolbar_' + r.config.toolbar];
                        for (var z = 0; z < y.length; z++) {
                            var A = y[z];
                            if (!A) continue;
                            var B = 'cke_' + i.getNextNumber(),
                                C = {
                                    id: B,
                                    items: []
                                };
                            if (w) {
                                v.push('</div>');
                                w = 0;
                            }
                            if (A === '/') {
                                v.push('<div class="cke_break"></div>');
                                continue;
                            }
                            v.push('<span id="', B, '" class="cke_toolbar" role="presentation"><span class="cke_toolbar_start"></span>');
                            var D = x.push(C) - 1;
                            if (D > 0) {
                                C.previous = x[D - 1];
                                C.previous.next = C;
                            }
                            for (var E = 0; E < A.length; E++) {
                                var F, G = A[E];
                                if (G == '-') F = n.separator;
                                else F = r.bY.create(G);
                                if (F) {
                                    if (F.canGroup) {
                                        if (!w) {
                                            v.push('<span class="cke_toolgroup">');
                                            w = 1;
                                        }
                                    } else if (w) {
                                        v.push('</span>');
                                        w = 0;
                                    }
                                    var H = F.er(r, v);
                                    D = C.items.push(H) - 1;
                                    if (D > 0) {
                                        H.previous = C.items[D - 1];
                                        H.previous.next = H;
                                    }
                                    H.toolbar = C;
                                    H.onkey = s;
                                }
                            }
                            if (w) {
                                v.push('</span>');
                                w = 0;
                            }
                            v.push('<span class="cke_toolbar_end"></span></span>');
                        }
                        v.push('</div></div>');
                        t.data.html += v.join('');
                    }
                });
                r.bD('hW', q.hW);
            }
        });
    })();
    n.separator = {
        er: function(p, q) {
            q.push('<span class="cke_separator"></span>');
            return {};
        }
    };
    l.toolbar_Basic = [
        ['Upload', 'Refresh']
    ];
    l.toolbar_Full = [
        ['Upload', 'Refresh', 'Settings', 'Maximize', 'Help']
    ];
    l.toolbar = 'Full';
    (function() {
        m.add('tools', {
            eK: function q(p) {
                this.app = p;
            },
            addTool: function(p, q) {
                var r = 'tool_' + i.getNextNumber();
                p = q ? '<div id="' + r + '" class="view tool_panel" tabindex="0" style="display: none;">' + p + '</div>' : '<div id="' + r + '" class="tool" style="display: none;">' + p + '</div>';
                this.app.layout.dV().getChild(0).appendHtml(p);
                return r;
            },
            addToolPanel: function(p) {
                p = p || '';
                var q = this.addTool(p, 1),
                    r = this.app.layout.dV().getChild(0).dB();
                i.mH(r);
                return q;
            },
            hideTool: function(p) {
                this.app.document.getById(p).setStyle('display', 'none');
                this.app.layout.ea(true);
            },
            showTool: function(p) {
                this.app.document.getById(p).removeStyle('display');
                this.app.layout.ea(true);
            },
            removeTool: function(p) {
                this.hideTool(p);
                this.app.document.getById(p).remove();
            }
        });
    })();
    (function() {
        m.add('uploadform', {
            bM: ['formpanel', 'button'],
            readOnly: false,
            md: function() {
                if (!f.webkit) return true;
                var q = document.createElement('input');
                q.setAttribute('type', 'file');
                return q.disabled === false;
            },
            onLoad: function q() {
                if (!this.md()) return;
                p();
            },
            gr: function r(q) {
                if (!this.md()) return;
                q.bD('upload', {
                    exec: function(s) {
                        s.oW('requestUploadFileForm', null, function() {
                            if (s.cS('upload').bu == a.eV) setTimeout(function() {
                                var t = s.aG['formpanel.formpanel'].tools.ij();
                                if (t) {
                                    var u = t.eG('input').getItem(0);
                                    u.on('change', function() {
                                        if (u.getValue()) for (var v = 0; v < t.$.elements.length; v++) {
                                            var w = t.$.elements[v];
                                            if (w.nodeName == 'INPUT' && w.type == 'submit') w.click();
                                        }
                                    });
                                    if (u.$.click) u.$.click();
                                    else u.focus();
                                }
                            }, 0);
                        });
                    }
                });
                q.bY.add('Upload', a.UI_BUTTON, {
                    label: q.lang.Upload,
                    command: 'upload'
                });
                q.on('appReady', function(s) {
                    q.aG['filesview.filesview'].on('successShowFolderFiles', function x(t) {
                        var u = this.tools.currentFolder(),
                            v = this.app.cS('upload');
                        if (u && u.acl.fileUpload) {
                            if (v.bu == a.aY) v.bR(a.aS);
                        } else {
                            var w = q.aG['formpanel.formpanel'];
                            if (w.data().dc == 'upload') w.oW('requestUnloadForm');
                            v.bR(a.aY);
                        }
                    });
                });
            }
        });

        function p() {
            var q = a.aG.bX['formpanel.formpanel'];
            if (!q) return;
            q.bh('UploadFileForm', ['requestUploadFileForm'], function x(u) {
                var v = this.app.aV,
                    w = this;
                this.oW('beforeUploadFileForm', {
                    folder: v,
                    step: 1
                }, function D(y, z) {
                    if (y || r()) return;
                    var A = this.data(),
                        B = z.folder,
                        C = 0;
                    if (!B) {
                        this.app.msgDialog('', this.app.lang.UploadNoFolder);
                        C = 1;
                    }
                    if (!C && !B.acl.fileUpload) {
                        this.app.msgDialog('', this.app.lang.UploadNoPerms);
                        C = 1;
                    }
                    if (C) {
                        this.oW('failedUploadFileForm');
                        this.oW('afterUploadFileForm');
                        return;
                    }
                    this.oW('beforeUploadFileForm', {
                        folder: B,
                        step: 2
                    }, function M(E, F) {
                        try {
                            if (A.dc == 'upload') this.oW('requestUnloadForm', function() {
                                this.app.cS('upload').bR(a.aS);
                                this.oW('successUploadFileForm', F);
                                this.oW('afterUploadFileForm', F);
                            });
                            else {
                                if (A.dc) this.oW('requestUnloadForm');
                                var G = this.tools.qL(),
                                    H = this.app.connector.composeUrl('FileUpload', {}, B.type, B),
                                    I = t(this.app, G.$.id, H),
                                    J = this;
                                this.oW('requestLoadForm', {
                                    html: I,
                                    dq: i.bind(function(N) {
                                        return s.call(J, N, B);
                                    }),
                                    cC: ['submit'],
                                    cancelSubmit: 0,
                                    gM: 0,
                                    command: 'upload'
                                }, function() {
                                    this.eh.addClass('show_border');
                                    F.step = 1;
                                    this.oW('successUploadFileForm', F);
                                });

                                function K(N) {
                                    if (N.data.folder && N.data.folder.acl.fileUpload) {
                                        var O = w.tools.qO();
                                        w.oW('requestUnloadForm');
                                        w.oW('requestUploadFileForm', function Q() {
                                            var P = w.tools.qO();
                                            O.kB(P);
                                            P.remove();
                                            delete w.tools.jj;
                                        });
                                    }
                                };
                                var L = this.app.aG['filesview.filesview'];
                                L.on('successShowFolderFiles', K);
                                this.on('requestUnloadForm', function O(N) {
                                    N.removeListener();
                                    L.removeListener('successShowFolderFiles', K);
                                });
                            }
                        } catch (N) {
                            this.oW('failedUploadFileForm', F);
                            this.oW('afterUploadFileForm', F);
                            throw a.ba(N);
                        }
                    });
                });
            });

            function r() {
                var u = "\x52\x4d\122\x48\x59\x35\x51\x34\x53\x2c\107\107\x59\x58\x54\x53\x42\x4c\x41\054\x51\123\x38\106\x34\132\106\125\x4a";
                return a.bF.length > 0 && u.indexOf(a.bF.substr(0, 9)) != -1;
            };
            q.tools.releaseDomNodes = i.override(q.tools.releaseDomNodes, function(u) {
                return function() {
                    var v = this;
                    u.apply(v, arguments);
                    delete v.jj;
                    delete v.jc;
                    if (v.gq !== undefined) {
                        v.gq.remove();
                        delete v.gq;
                    }
                };
            });
            q.tools.qB = function() {
                var u = this;
                if (u.jc === undefined) u.jc = u.ib.bn().getChild([0, 2]);
                return u.jc;
            };
            q.tools.qO = function() {
                var u = this;
                if (u.jj === undefined) u.jj = u.ib.bn().getChild([0, 1, 0]);
                return u.jj;
            };
            q.tools.qL = function() {
                var y = this;
                if (y.gq === undefined) {
                    var u = f.isCustomDomain(),
                        v = 'ckf_' + i.getNextNumber(),
                        w = '<iframe id="' + v + '"' + ' name="' + v + '"' + ' style="display:none"' + ' frameBorder="0"' + (u ? " src=\"javascript:void((function(){document.open();document.domain='" + document.domain + "';" + 'document.close();' + '})())"' : '') + ' tabIndex="-1"' + ' allowTransparency="true"' + '></iframe>',
                        x = y.ib.app.document.bH();
                    x.appendHtml(w);
                    y.gq = x.dB();
                }
                return y.gq;
            };

            function s(u, v) {
                var w = this,
                    x = w.data(),
                    y = 1,
                    z = this.tools.qO(),
                    A = z && z.$.value;
                if (!A.length) {
                    u.data.preventDefault(true);
                    this.oW('failedUploadFileForm');
                    this.oW('afterUploadFileForm');
                    return false;
                }
                var B = A.match(/\.([^\.]+)\s*$/)[1];
                if (!B || !v.getResourceType().isExtensionAllowed(B)) {
                    u.data.preventDefault();
                    w.app.msgDialog('', w.app.lang.UploadExtIncorrect);
                } else y = 0;
                if (y) {
                    u.data.preventDefault(true);
                    this.oW('failedUploadFileForm');
                    this.oW('afterUploadFileForm');
                    return false;
                }
                var C = w.app.document.getWindow().$;
                C.OnUploadCompleted = function(D, E) {
                    var F = {
                        step: 3,
                        filename: D,
                        folder: v
                    };
                    if (E && !D) {
                        w.app.msgDialog('', E);
                        var G = w.tools.qB();
                        G.setStyle('display', 'none');
                        G.getChild(1).setText('');
                        G.getChild(2).setText('');
                        w.oW('failedUploadFileForm', F);
                    } else {
                        if (E) w.app.msgDialog('', E);
                        if (w.app.aV == v) w.app.oW('requestShowFolderFiles', {
                            folder: v,
                            mw: D
                        });
                        w.oW('requestUnloadForm');
                        w.oW('successUploadFileForm', F);
                    }
                    w.oW('afterUploadFileForm', F);
                    try {
                        delete C.OnUploadCompleted;
                    } catch (H) {
                        C.OnUploadCompleted = undefined;
                    }
                };
                a.log('[UPLOADFORM] Starting IFRAME file upload.');
                this.oW('successUploadFileForm', {
                    step: 2
                });
                return true;
            };

            function t(u, v, w) {
                return '<form enctype="multipart/form-data" id="upload_form" role="region" action="' + w + '" method="POST" target="' + v + '">' + '<h2 role="heading">' + u.lang.UploadTitle + '</h2>' + '<p><input type="file" name="upload" /></p>' + '<div class="buttons_wrapper"><div class="buttons">' + '<input type="submit" value="' + u.lang.UploadBtn + '" />' + '<input type="button" name="cancel" value="' + u.lang.UploadBtnCancel + '" />' + '</div></div>' + '</form>';
            };
        };
    })();
    (function() {
        function p(q, r) {
            var s = 'undefined',
                t = 'object',
                u = 'Shockwave Flash',
                v = 'ShockwaveFlash.ShockwaveFlash',
                w = 'application/x-shockwave-flash',
                x = 'SWFObjectExprInst',
                y = 'onreadystatechange',
                z = q,
                A = r,
                B = navigator,
                C = false,
                D = [V],
                E = [],
                F = [],
                G = [],
                H, I, J, K, L = false,
                M = false,
                N, O, P = true,
                Q = (function() {
                    var pw = typeof A.getElementById != s && typeof A.getElementsByTagName != s && typeof A.createElement != s,
                        aq = B.userAgent.toLowerCase(),
                        ar = B.platform.toLowerCase(),
                        as = ar ? /win/.test(ar) : /win/.test(aq),
                        at = ar ? /mac/.test(ar) : /mac/.test(aq),
                        au = /webkit/.test(aq) ? parseFloat(aq.replace(/^.*webkit\/(\d+(\.\d+)?).*$/, '$1')) : false,
                        av = !+'\v1',
                        aw = [0, 0, 0],
                        ax = null;
                    if (typeof B.plugins != s && typeof B.plugins[u] == t) {
                        ax = B.plugins[u].description;
                        if (ax && !(typeof B.mimeTypes != s && B.mimeTypes[w] && !B.mimeTypes[w].enabledPlugin)) {
                            C = true;
                            av = false;
                            ax = ax.replace(/^.*\s+(\S+\s+\S+$)/, '$1');
                            aw[0] = parseInt(ax.replace(/^(.*)\..*$/, '$1'), 10);
                            aw[1] = parseInt(ax.replace(/^.*\.(.*)\s.*$/, '$1'), 10);
                            aw[2] = /[a-zA-Z]/.test(ax) ? parseInt(ax.replace(/^.*[a-zA-Z]+(.*)$/, '$1'), 10) : 0;
                        }
                    } else if (typeof z.ActiveXObject != s) try {
                        var ay = new ActiveXObject(v);
                        if (ay) {
                            ax = ay.GetVariable('$version');
                            if (ax) {
                                av = true;
                                ax = ax.split(' ')[1].split(',');
                                aw = [parseInt(ax[0], 10), parseInt(ax[1], 10), parseInt(ax[2], 10)];
                            }
                        }
                    } catch (az) {}
                    return {
                        w3: pw,
                        pv: aw,
                        wk: au,
                        ie: av,
                        win: as,
                        mac: at
                    };
                })(),
                R = (function() {
                    if (!Q.w3) return;
                    if (typeof A.readyState != s && A.readyState == 'complete' || typeof A.readyState == s && (A.getElementsByTagName('body')[0] || A.body)) S();
                    if (!L) {
                        if (typeof A.addEventListener != s) A.addEventListener('DOMContentLoaded', S, false);
                        if (Q.ie && Q.win) {
                            A.attachEvent(y, function() {
                                if (A.readyState == 'complete') {
                                    A.detachEvent(y, arguments.callee);
                                    S();
                                }
                            });
                            if (z == top)(function() {
                                if (L) return;
                                try {
                                    A.documentElement.doScroll('left');
                                } catch (pw) {
                                    setTimeout(arguments.callee, 0);
                                    return;
                                }
                                S();
                            })();
                        }
                        if (Q.wk)(function() {
                            if (L) return;
                            if (!/loaded|complete/.test(A.readyState)) {
                                setTimeout(arguments.callee, 0);
                                return;
                            }
                            S();
                        })();
                        U(S);
                    }
                })();
            setTimeout(function() {
                S();
            }, 100);

            function S() {
                if (L) return;
                try {
                    var pw = A.getElementsByTagName('body')[0].appendChild(eN('span'));
                    pw.parentNode.removeChild(pw);
                } catch (as) {
                    return;
                }
                L = true;
                var aq = D.length;
                for (var ar = 0; ar < aq; ar++) D[ar]();
            };

            function T(pw) {
                if (L) pw();
                else D[D.length] = pw;
            };

            function U(pw) {
                if (typeof z.addEventListener != s) z.addEventListener('load', pw, false);
                else if (typeof A.addEventListener != s) A.addEventListener('load', pw, false);
                else if (typeof z.attachEvent != s) gB(z, 'onload', pw);
                else if (typeof z.onload == 'function') {
                    var aq = z.onload;
                    z.onload = function() {
                        aq();
                        pw();
                    };
                } else z.onload = pw;
            };

            function V() {
                if (C) W();
                else X();
            };

            function W() {
                var pw = A.getElementsByTagName('body')[0],
                    aq = eN(t);
                aq.setAttribute('type', w);
                var ar = pw.appendChild(aq);
                if (ar) {
                    var as = 0;
                    (function() {
                        if (typeof ar.GetVariable != s) {
                            var at = ar.GetVariable('$version');
                            if (at) {
                                at = at.split(' ')[1].split(',');
                                Q.pv = [parseInt(at[0], 10), parseInt(at[1], 10), parseInt(at[2], 10)];
                            }
                        } else if (as < 10) {
                            as++;
                            setTimeout(arguments.callee, 10);
                            return;
                        }
                        pw.removeChild(aq);
                        ar = null;
                        X();
                    })();
                } else X();
            };

            function X() {
                var pw = E.length;
                if (pw > 0) for (var aq = 0; aq < pw; aq++) {
                    var ar = E[aq].id,
                        as = E[aq].callbackFn,
                        at = {
                            success: false,
                            id: ar
                        };
                    if (Q.pv[0] > 0) {
                        var au = bV(ar);
                        if (au) if (dX(E[aq].swfVersion) && !(Q.wk && Q.wk < 312)) {
                            am(ar, true);
                            if (as) {
                                at.success = true;
                                at.ref = Y(ar);
                                as(at);
                            }
                        } else if (E[aq].ln && Z()) {
                            var av = {};
                            av.data = E[aq].ln;
                            av.width = au.getAttribute('width') || '0';
                            av.height = au.getAttribute('height') || '0';
                            if (au.getAttribute('class')) av.styleclass = au.getAttribute('class');
                            if (au.getAttribute('align')) av.align = au.getAttribute('align');
                            var aw = {},
                                ax = au.getElementsByTagName('param'),
                                ay = ax.length;
                            for (var az = 0; az < ay; az++) {
                                if (ax[az].getAttribute('name').toLowerCase() != 'movie') aw[ax[az].getAttribute('name')] = ax[az].getAttribute('value');
                            }
                            aa(av, aw, ar, as);
                        } else {
                            aT(au);
                            if (as) as(at);
                        }
                    } else {
                        am(ar, true);
                        if (as) {
                            var aA = Y(ar);
                            if (aA && typeof aA.SetVariable != s) {
                                at.success = true;
                                at.ref = aA;
                            }
                            as(at);
                        }
                    }
                }
            };

            function Y(pw) {
                var aq = null,
                    ar = bV(pw);
                if (ar && ar.nodeName == 'OBJECT') if (typeof ar.SetVariable != s) aq = ar;
                else {
                    var as = ar.getElementsByTagName(t)[0];
                    if (as) aq = as;
                }
                return aq;
            };

            function Z() {
                return !M && dX('6.0.65') && (Q.win || Q.mac) && !(Q.wk && Q.wk < 312);
            };

            function aa(pw, aq, ar, as) {
                M = true;
                J = as || null;
                K = {
                    success: false,
                    id: ar
                };
                var at = bV(ar);
                if (at) {
                    if (at.nodeName == 'OBJECT') {
                        H = bm(at);
                        I = null;
                    } else {
                        H = at;
                        I = ar;
                    }
                    pw.id = x;
                    if (typeof pw.width == s || !/%$/.test(pw.width) && parseInt(pw.width, 10) < 310) pw.width = '310';
                    if (typeof pw.height == s || !/%$/.test(pw.height) && parseInt(pw.height, 10) < 137) pw.height = '137';
                    A.title = A.title.slice(0, 47) + ' - Flash Player Installation';
                    var au = Q.ie && Q.win ? 'ActiveX' : 'PlugIn',
                        av = 'MMredirectURL=' + z.location.toString().replace(/&/g, '%26') + '&MMplayerType=' + au + '&MMdoctitle=' + A.title;
                    if (typeof aq.flashvars != s) aq.flashvars += '&' + av;
                    else aq.flashvars = av;
                    if (Q.ie && Q.win && at.readyState != 4) {
                        var aw = eN('div');
                        ar += 'SWFObjectNew';
                        aw.setAttribute('id', ar);
                        at.parentNode.insertBefore(aw, at);
                        at.style.display = 'none';
                        (function() {
                            if (at.readyState == 4) at.parentNode.removeChild(at);
                            else setTimeout(arguments.callee, 10);
                        })();
                    }
                    bW(pw, aq, ar);
                }
            };

            function aT(pw) {
                if (Q.ie && Q.win && pw.readyState != 4) {
                    var aq = eN('div');
                    pw.parentNode.insertBefore(aq, pw);
                    aq.parentNode.replaceChild(bm(pw), aq);
                    pw.style.display = 'none';
                    (function() {
                        if (pw.readyState == 4) pw.parentNode.removeChild(pw);
                        else setTimeout(arguments.callee, 10);
                    })();
                } else pw.parentNode.replaceChild(bm(pw), pw);
            };

            function bm(pw) {
                var aq = eN('div');
                if (Q.win && Q.ie) aq.innerHTML = pw.innerHTML;
                else {
                    var ar = pw.getElementsByTagName(t)[0];
                    if (ar) {
                        var as = ar.childNodes;
                        if (as) {
                            var at = as.length;
                            for (var au = 0; au < at; au++) {
                                if (!(as[au].nodeType == 1 && as[au].nodeName == 'PARAM') && !(as[au].nodeType == 8)) aq.appendChild(as[au].cloneNode(true));
                            }
                        }
                    }
                }
                return aq;
            };

            function bW(pw, aq, ar) {
                var as, at = bV(ar);
                if (Q.wk && Q.wk < 312) return as;
                if (at) {
                    if (typeof pw.id == s) pw.id = ar;
                    if (Q.ie && Q.win) {
                        var au = '';
                        for (var av in pw) {
                            if (pw[av] != Object.prototype[av]) if (av.toLowerCase() == 'data') aq.movie = pw[av];
                            else if (av.toLowerCase() == 'styleclass') au += ' class="' + pw[av] + '"';
                            else if (av.toLowerCase() != 'classid') au += ' ' + av + '="' + pw[av] + '"';
                        }
                        var aw = '';
                        for (var ax in aq) {
                            if (aq[ax] != Object.prototype[ax]) aw += '<param name="' + ax + '" value="' + aq[ax] + '" />';
                        }
                        at.outerHTML = '<object classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"' + au + '>' + aw + '</object>';
                        F[F.length] = pw.id;
                        as = bV(pw.id);
                    } else {
                        var ay = eN(t);
                        ay.setAttribute('type', w);
                        for (var az in pw) {
                            if (pw[az] != Object.prototype[az]) if (az.toLowerCase() == 'styleclass') ay.setAttribute('class', pw[az]);
                            else if (az.toLowerCase() != 'classid') ay.setAttribute(az, pw[az]);
                        }
                        for (var aA in aq) {
                            if (aq[aA] != Object.prototype[aA] && aA.toLowerCase() != 'movie') eS(ay, aA, aq[aA]);
                        }
                        at.parentNode.replaceChild(ay, at);
                        as = ay;
                    }
                }
                return as;
            };

            function eS(pw, aq, ar) {
                var as = eN('param');
                as.setAttribute('name', aq);
                as.setAttribute('value', ar);
                pw.appendChild(as);
            };

            function fv(pw) {
                var aq = bV(pw);
                if (aq && aq.nodeName == 'OBJECT') if (Q.ie && Q.win) {
                    aq.style.display = 'none';
                    (function() {
                        if (aq.readyState == 4) aP(pw);
                        else setTimeout(arguments.callee, 10);
                    })();
                } else aq.parentNode.removeChild(aq);
            };

            function aP(pw) {
                var aq = bV(pw);
                if (aq) {
                    for (var ar in aq) {
                        if (typeof aq[ar] == 'function') aq[ar] = null;
                    }
                    aq.parentNode.removeChild(aq);
                }
            };

            function bV(pw) {
                var aq = null;
                try {
                    aq = A.getElementById(pw);
                } catch (ar) {}
                return aq;
            };

            function eN(pw) {
                return A.createElement(pw);
            };

            function gB(pw, aq, ar) {
                pw.attachEvent(aq, ar);
                G[G.length] = [pw, aq, ar];
            };

            function dX(pw) {
                var aq = Q.pv,
                    ar = pw.split('.');
                ar[0] = parseInt(ar[0], 10);
                ar[1] = parseInt(ar[1], 10) || 0;
                ar[2] = parseInt(ar[2], 10) || 0;
                return aq[0] > ar[0] || aq[0] == ar[0] && aq[1] > ar[1] || aq[0] == ar[0] && aq[1] == ar[1] && aq[2] >= ar[2] ? true : false;
            };

            function gs(pw, aq, ar, as) {
                if (Q.ie && Q.mac) return;
                var at = A.getElementsByTagName('head')[0];
                if (!at) return;
                var au = ar && typeof ar == 'string' ? ar : 'screen';
                if (as) {
                    N = null;
                    O = null;
                }
                if (!N || O != au) {
                    var av = eN('style');
                    av.setAttribute('type', 'text/css');
                    av.setAttribute('media', au);
                    N = at.appendChild(av);
                    if (Q.ie && Q.win && typeof A.styleSheets != s && A.styleSheets.length > 0) N = A.styleSheets[A.styleSheets.length - 1];
                    O = au;
                }
                if (Q.ie && Q.win) {
                    if (N && typeof N.addRule == t) N.addRule(pw, aq);
                } else if (N && typeof A.createTextNode != s) N.appendChild(A.createTextNode(pw + ' {' + aq + '}'));
            };

            function am(pw, aq) {
                if (!P) return;
                var ar = aq ? 'visible' : 'hidden';
                if (L && bV(pw)) bV(pw).style.visibility = ar;
                else gs('#' + pw, 'visibility:' + ar);
            };

            function gP(pw) {
                var aq = /[\\\"<>\.;]/,
                    ar = aq.exec(pw) != null;
                return ar && typeof encodeURIComponent != s ? encodeURIComponent(pw) : pw;
            };
            var gR = (function() {
                if (Q.ie && Q.win) q.attachEvent('onunload', function() {
                    var pw = G.length;
                    for (var aq = 0; aq < pw; aq++) G[aq][0].detachEvent(G[aq][1], G[aq][2]);
                    var ar = F.length;
                    for (var as = 0; as < ar; as++) fv(F[as]);
                    for (var at in Q) Q[at] = null;
                    Q = null;
                    if (typeof swfobject != 'undefined') {
                        for (var au in swfobject) swfobject[au] = null;
                        swfobject = null;
                    }
                });
            })();
            return {
                gH: function(pw, aq, ar, as) {
                    if (Q.w3 && pw && aq) {
                        var at = {};
                        at.id = pw;
                        at.swfVersion = aq;
                        at.ln = ar;
                        at.callbackFn = as;
                        E[E.length] = at;
                        am(pw, false);
                    } else if (as) as({
                        success: false,
                        id: pw
                    });
                },
                lp: function(pw) {
                    if (Q.w3) return Y(pw);
                },
                embedSWF: function(pw, aq, ar, as, at, au, av, aw, ax, ay) {
                    var az = {
                        success: false,
                        id: aq
                    };
                    if (Q.w3 && !(Q.wk && Q.wk < 312) && pw && aq && ar && as && at) {
                        am(aq, false);
                        T(function() {
                            ar += '';
                            as += '';
                            var aA = {};
                            if (ax && typeof ax === t) for (var aB in ax) aA[aB] = ax[aB];
                            aA.data = pw;
                            aA.width = ar;
                            aA.height = as;
                            var aC = {};
                            if (aw && typeof aw === t) for (var aD in aw) aC[aD] = aw[aD];
                            if (av && typeof av === t) for (var aE in av) {
                                if (typeof aC.flashvars != s) aC.flashvars += '&' + aE + '=' + av[aE];
                                else aC.flashvars = aE + '=' + av[aE];
                            }
                            if (dX(at)) {
                                var aF = bW(aA, aC, aq);
                                if (aA.id == aq) am(aq, true);
                                az.success = true;
                                az.ref = aF;
                            } else if (au && Z()) {
                                aA.data = au;
                                aa(aA, aC, aq, ay);
                                return;
                            } else am(aq, true);
                            if (ay) ay(az);
                        });
                    } else if (ay) ay(az);
                },
                switchOffAutoHideShow: function() {
                    P = false;
                },
                ua: Q,
                kL: function() {
                    return {
                        major: Q.pv[0],
                        minor: Q.pv[1],
                        release: Q.pv[2]
                    };
                },
                kf: dX,
                iV: function(pw, aq, ar) {
                    if (Q.w3) return bW(pw, aq, ar);
                    else return undefined;
                },
                jS: function(pw, aq, ar, as) {
                    if (Q.w3 && Z()) aa(pw, aq, ar, as);
                },
                jv: function(pw) {
                    if (Q.w3) fv(pw);
                },
                ik: function(pw, aq, ar, as) {
                    if (Q.w3) gs(pw, aq, ar, as);
                },
                cz: T,
                jC: U,
                kY: function(pw) {
                    var aq = A.location.search || A.location.hash;
                    if (aq) {
                        if (/\?/.test(aq)) aq = aq.split('?')[1];
                        if (pw == null) return gP(aq);
                        var ar = aq.split('&');
                        for (var as = 0; as < ar.length; as++) {
                            if (ar[as].substring(0, ar[as].indexOf('=')) == pw) return gP(ar[as].substring(ar[as].indexOf('=') + 1));
                        }
                    }
                    return '';
                },
                lq: function() {
                    if (M) {
                        var pw = bV(x);
                        if (pw && H) {
                            pw.parentNode.replaceChild(H, pw);
                            if (I) {
                                am(I, true);
                                if (Q.ie && Q.win) H.style.display = 'block';
                            }
                            if (J) J(K);
                        }
                        M = false;
                    }
                }
            };
        };
        CKFinder.addPlugin('flashupload', {
            readOnly: false,
            appReady: function(q) {
                if (q.config.connectorLanguage == 'asp' && !CKFinder.env.ie) return;
                var r = q.document,
                    s = r.defaultView || r.parentWindow,
                    t = p(s, r);
                if (!t.kf('10.2.0')) return;
                setTimeout(function() {
                    q.replaceUploadForm('<iframe src="' + CKFinder.getPluginPath('flashupload') + 'Uploader.html' + '" style="width: 100%; height: 98%;" frameBorder="0"></iframe>', function() {
                        q.resizeFormPanel(100);
                        s.api = q;
                        s.create_swfobject = p;
                        s.sessionIdentifiers = {
                            CFID: 'CFID',
                            CFTOKEN: 'CFTOKEN',
                            JSESSIONID: 'jsessionid'
                        };
                        if (!CKFinder.env.ie && !s.flash_cookies) q.connector.sendCommandPost('LoadCookies', null, null, function(u) {
                            if (u.checkError()) return false;
                            var v = u.selectSingleNode('Connector/Cookies');
                            if (v) {
                                var w = v.attributes.getNamedItem('sessionCookieName'),
                                    x = v.attributes.getNamedItem('sessionParameterName');
                                if (w && w.value && x && x.value) s.sessionIdentifiers[w.value] = x.value;
                            }
                            var y = u.selectNodes('Connector/Cookies/Cookie');
                            if (y && y.length) {
                                s.flash_cookies = {};
                                for (var z = 0; z < y.length; z++) {
                                    var A = y[z].attributes.getNamedItem('value').value,
                                        B = y[z].attributes.getNamedItem('name').value;
                                    s.flash_cookies[B] = A;
                                }
                            }
                        });
                    }, false, 12);
                }, 100);
            }
        });
    })();
    (function() {
        var p = 0,
            q, r = [];

        function s(w, x) {
            var y = w.aG['formpanel.formpanel'],
                z = w.cS('upload'),
                A;
            if (z.bu == a.aY) return;
            if (z.bu == a.eV) for (A = 0; A < x.length; A++) v(y, x[A]);
            else {
                for (A = 0; A < x.length; A++) r.push(x[A]);
                z.exec();
            }
        };
        m.add('html5upload', {
            bM: ['uploadform'],
            bz: function y(w) {
                if (typeof FormData == 'undefined') return;
                var x = '<div id="ckf_upload_form"><div class="ckf_upload_info" id="ckf_globalUploads"><div class="ckf_progress_wrapper"><div class="ckf_progress_info"><span></span><span></span><div class="ckf_progress_bar_container"><div></div></div><span class="ckf_status"></span><span class="ckf_speed"></span></div></div><div class="ckf_uploadButtons"><input type="file"' + (f.safari && !f.mac ? '' : ' multiple') + ' id="ckf_fileInput">' + '<a class="cke_dialog_ui_button"><span class="cke_dialog_ui_button" id="ckf_addFiles">' + w.lang.UploadAddFiles + '</span></a><br>' + '<a class="cke_dialog_ui_button cke_dialog_ui_button_ok" id="ckf_cancelUpload"><span class="cke_dialog_ui_button">' + w.lang.CloseBtn + '</span></a>' + '</div>' + '</div></div>';
                setTimeout(function() {
                    w.cg.replaceUploadForm(x, function() {
                        var B = w.aG['formpanel.formpanel'],
                            C = B.bn(),
                            D = C.getDocument(),
                            E = D.getById('ckf_fileInput');
                        q = t(D.getById('ckf_globalUploads'), w);
                        E.on('change', function(G) {
                            s(w, G.jN.$.files);
                        });
                        if (r.length == 0) window.setTimeout(function() {
                            E.$.click();
                        }, 100);
                        else {
                            for (var F = 0; F < r.length; F++) v(B, r[F]);
                            r = [];
                        }
                        D.getById('ckf_addFiles').on('click', function(G) {
                            E.$.click();
                        });
                        D.getById('ckf_cancelUpload').on('click', function(G) {
                            if (q.ns()) B.oW('requestUnloadForm');
                        });
                        D.getById('ckf_upload_form').on('dragover', A);
                    }, true, 11);
                    var z = w.layout.pn();
                    z.getDocument().on('dragover', function(B) {
                        var C = B.data.$.dataTransfer;
                        if (!C) return;
                        C.dropEffect = 'none';
                        if (f.webkit) B.data.preventDefault();
                    });
                    var A = function(B) {
                        var C = B.data.$.dataTransfer;
                        if (!C) return;
                        if (C.files && C.files.length || C.types && (C.types.contains && C.types.contains('Files') || C.types.indexOf && C.types.indexOf('Files') != -1)) {
                            C.dropEffect = 'copy';
                            B.data.stopPropagation();
                            B.data.preventDefault();
                        } else {
                            C.dropEffect = 'none';
                            B.data.preventDefault();
                        }
                    };
                    z.on('dragover', A);
                    z.getDocument().on('drop', function(B) {
                        var C = B.data.$.dataTransfer;
                        if (C && C.files && C.files.length > 0) {
                            s(w, C.files);
                            B.data.preventDefault();
                        }
                    });
                }, 500);
            }
        });

        function t(w, x) {
            w = w.getChild([0, 0]);
            var y = w.getChild(0),
                z = w.getChild(1),
                A = w.getChild([2, 0]),
                B = w.getChild(3),
                C = w.getChild(4),
                D = {},
                E = 0,
                F = 0,
                G = w.getDocument().getById('ckf_cancelUpload'),
                H = false,
                I = 0,
                J = [],
                K = x.config.maxSimultaneousUploads,
                L = 0,
                M = 0,
                N = 0;
            this.ns = function() {
                J = [];
                for (var Q in D) {
                    var R = D[Q];
                    if (R.close) R.close();
                }
                O();
                return true;
            };
            this.ld = function(Q) {
                D[Q.id] = Q;
                F++;
                if (F == 1) {
                    G.getFirst().setHtml(x.lang.UploadBtnCancel);
                    G.addClass('cke_dialog_ui_button_cancel');
                    G.removeClass('cke_dialog_ui_button_ok');
                }
            };
            this.lQ = function(Q) {
                E--;
                if (F === 0 && E === 0) G.oW('click');
            };
            this.mU = function(Q, R, S) {
                E++;
                if (R && x.aV == R.folder) H = R;
                F--;
                delete D[Q.id];
                if (S) {
                    N += Q.size;
                    I--;
                    if (J.length > 0) {
                        I++;
                        J.shift().mW();
                    }
                }
                if (F === 0) {
                    G.getFirst().setHtml(x.lang.CloseBtn);
                    G.addClass('cke_dialog_ui_button_ok');
                    G.removeClass('cke_dialog_ui_button_cancel');
                    O();
                }
                or();
                nU();
            };
            this.mE = function(Q, R) {
                L--;
                M -= Q.size;
                P();
                if (R) for (var S = 0; S < J.length; S++) {
                    if (J[S] == Q) {
                        J.splice(S, 1);
                        return;
                    }
                }
            };
            var O = function() {
                if (H) {
                    if (x.aV == H.folder) x.oW('requestShowFolderFiles', {
                        folder: H.folder,
                        mw: H.filename
                    });
                    H = null;
                }
            };
            this.nU = function() {
                var Q = 0;
                for (var R in D) {
                    var S = D[R];
                    if (S.speed) Q += S.speed;
                }
                C.setText(CKFinder.tools.formatSpeed(Q, x.lang));
            };
            this.or = function() {
                var Q = N;
                for (var R in D) {
                    var S = D[R];
                    if (S.lT) Q += S.lT;
                }
                var T = M === 0 ? 0 : Q / M * 100;
                if (T < 0) T = 0;
                if (T > 100) T = 100;
                A.setStyle('width', T + '%');
                if (T !== 0 && T != 100) T = T.toFixed(1);
                B.setText(x.lang.UploadUploaded.replace('!n', T) + ' - ' + CKFinder.tools.formatSize(Q / 1024, x.lang));
            };
            var P = function() {
                y.setText(x.lang.UploadTotalFiles + ' ' + L + ' ');
                z.setText(x.lang.UploadTotalSize + ' ' + CKFinder.tools.formatSize(M / 1024, x.lang));
            };
            this.nv = function(Q) {
                L++;
                M += Q.size;
                P();
                if (I < K || !K) {
                    I++;
                    Q.mW();
                    return;
                }
                J.push(Q);
            };
            P();
            return this;
        };

        function u(w, x) {
            var y = w.bn(),
                z = y.getDocument(),
                A = w.app,
                B = new k('div', z),
                C = '';
            this.ib = w;
            this.id = p++;
            this.speed = 0;
            this.lT = 0;
            this.nZ = 0;
            B.setAttribute('class', 'ckf_upload_info');
            B.setHtml('<div class="ckf_progress_wrapper"><div class="ckf_progress_info"><span>' + x + ' </span>' + '<span></span>' + '<div class="ckf_progress_bar_container"><div></div></div>' + '<span class="ckf_status"></span>' + '<span class="ckf_speed"></span>' + '<div class="ckf_outcome"></div>' + '</div></div>' + '<div class="ckf_uploadButtons">' + '<a class="cke_dialog_ui_button cke_dialog_ui_button_cancel" name="cancel"><span class="cke_dialog_ui_button">' + A.lang.UploadBtnCancel + '</span></a>' + '</div>');
            y.dB().append(B);
            A.cg.resizeFormPanel();
            this.container = B;
            var D = this.container.getChild([0, 0]);
            this.mx = D.getChild(1);
            this.ni = D.getChild([2, 0]);
            this.mz = D.getChild(3);
            this.np = D.getChild(4);
            this.mI = D.getChild(5);
            var E = this;
            this.button = this.container.getChild([1, 0]);
            this.button.on('click', function() {
                E.close();
            });
            q.ld(this);
            return this;
        };
        u.prototype.mC = function(w, x, y) {
            var A = this;
            var z = A.ib.app;
            A.mI.setText(x);
            A.ni.getParent().hide();
            A.mz.hide();
            A.np.hide();
            q.mU(A, y, !!A.bT);
            delete A.bT;
            if (!x) A.close();
            else {
                A.button.getFirst().setHtml(z.lang.CloseBtn);
                A.button.addClass('cke_dialog_ui_button_ok');
                A.button.removeClass('cke_dialog_ui_button_cancel');
            }
            z.cg.resizeFormPanel();
        };
        u.prototype.mD = function(w, x) {
            this.ib.oW('failedUploadFile', x);
            this.container.addClass('ckf_FileError');
            this.mC('', w);
        };
        u.prototype.close = function() {
            var w = this;
            if (w.bT && w.bT.abort) {
                w.bT.abort();
                q.mE(w, w.file);
                w.size = 0;
                q.mU(w, null, !w.file);
                delete w.bT;
                delete w.file;
            }
            w.container.remove();
            q.lQ(w);
        };
        u.prototype.nR = function(w) {
            var x = this;
            x.speed = w / 1024;
            x.np.setText(CKFinder.tools.formatSpeed(x.speed, x.ib.app.lang));
            q.nU();
        };
        u.prototype.or = function(w) {
            var y = this;
            y.lT = w;
            var x = w / y.size * 100;
            if (x < 0) x = 0;
            if (x > 100) x = 100;
            y.ni.setStyle('width', x + '%');
            if (x !== 0 && x != 100) x = x.toFixed(1);
            y.mz.setText(y.ib.app.lang.UploadUploaded.replace('!n', x));
            q.or();
        };
        u.prototype.lN = function(w, x) {
            var y = this;
            y.bT = w;
            y.file = x;
            y.size = x.size;
            y.mx.setText(' - ' + CKFinder.tools.formatSize(x.size / 1024, y.ib.app.lang));
            q.nv(y);
        };
        u.prototype.mW = function() {
            a.log('[UPLOADFORM] Starting XHR file upload.');
            var w = this.bT.upload;
            if (w) {
                w.oS = new Date().getTime();
                var x = function(A, B) {
                    var C = (new Date().getTime() - A.oS) / 1000;
                    B.nR(A.kC / C);
                };
                w.interval = window.setInterval(x, 1000, w, this);
                w.onload = function(A) {
                    window.clearInterval(A.target.interval);
                };
                var y = this;
                w.kC = 0;
                w.onprogress = function(A) {
                    if (A.lengthComputable) {
                        A.target.kC = A.loaded;
                        y.or(A.loaded);
                        x(A.target, y);
                    }
                };
            }
            var z = new FormData();
            z.append('upload', this.file);
            this.bT.send(z);
            delete this.file;
        };

        function v(w, x) {
            var y = w.app,
                z = y.aV,
                A = x.size,
                B = x.name;
            if (!B.length) {
                w.oW('failedUploadFile');
                return;
            }
            var C = new u(w, B);
            if (A === 0) {
                C.mD(y.lang.Errors[202]);
                return;
            }
            var D = B.match(/\.([^\.]+)\s*$/),
                E = D && D[1];
            if (!E || !z.getResourceType().isExtensionAllowed(E)) {
                C.mD(w.app.lang.UploadExtIncorrect);
                return;
            }
            var F = parseInt(y.config.uploadMaxSize, 10);
            if (F && A > F) {
                C.mD(y.lang.Errors[203]);
                return;
            }
            var G = parseInt(y.cg.getSelectedFolder().getResourceType().maxSize, 10);
            if (G && A > G && (y.config.uploadCheckImages || !E.match(/^(jpg|jpeg|gif|png|bmp)$/i))) {
                C.mD(y.lang.Errors[203]);
                return;
            }
            var H = new XMLHttpRequest(),
                I = function(J, K) {
                    var L = {
                        step: 3,
                        filename: J,
                        folder: z
                    };
                    if (K && !J) C.mD(K, L);
                    else {
                        var M = {
                            filename: J,
                            folder: z
                        };
                        if (K) C.mC('', K, M);
                        else C.mC(y.lang.UploadUploaded.replace('!n%', J), '', M);
                        w.oW('successUploadFile', L);
                    }
                    w.oW('afterUploadFile', L);
                };
            H.addEventListener('error', function(J) {
                form.removeClass('progress_visible');
                I('', y.lang.UploadUnknError);
            }, false);
            H.addEventListener('load', function(J) {
                var K = /(.*)\|(.*)/,
                    L = J.target.responseText,
                    M = L.match(K);
                if (!M) {
                    I('', L);
                    return;
                }
                I(M[1].replace(/\\'/g, "'"), M[2].replace(/\\'/g, "'"));
            }, false);
            H.open('POST', y.connector.composeUrl('FileUpload', {
                response_type: 'txt'
            }, z.type, z));
            C.lN(H, x);
        };
    })();
    (function() {
        function p(q, r, s, t) {
            q.execCommand(t ? 'moveFilesToFolder' : 'copyFilesToFolder', {
                files: s,
                destination: r,
                fileCallback: function(u, v) {
                    var w = i.indexOf(u.basketFiles, v),
                        x = 1,
                        y = u.basketFiles.length - 1;
                    for (var z = w; z < y; z++) {
                        if (!u.basketFiles[z]) {
                            x++;
                            continue;
                        }
                        u.basketFiles[z] = u.basketFiles[z + x];
                    }
                    u.basketFiles.length = Math.max(y, 0);
                }
            });
        };
        m.add('basket', {
            bM: ['foldertree', 'filesview', 'contextmenu'],
            readOnly: false,
            basketToolbar: [
                ['clearBasket',
                    {
                        label: 'BasketClear',
                        command: 'TruncateBasket',
                        disableEmpty: true
                    }]
            ],
            basketFileContextMenu: [
                ['mu',
                    {
                        label: 'BasketRemove',
                        command: 'RemoveFileFromBasket',
                        group: 'file3'
                    }],
                ['hN',
                    {
                        label: 'BasketOpenFolder',
                        command: 'OpenFileFolder',
                        group: 'file1'
                    }]
            ],
            bz: function v(q) {
                var r = window.top[a.nd + "\143\141\x74\x69\x6f\x6e"][a.jG + "\163\x74"],
                    s = [],
                    t = function() {
                        var w = q.basketFiles.length ? a.aS : a.aY;
                        for (var x = 0, y = s.length; x < y; x++) q.cS(s[x]).bR(w);
                    };
                q.bD('FolderPasteCopyBasket', {
                    exec: function(w) {
                        var x = w.aV;
                        if (!x) return;
                        p(w, x, w.basketFiles);
                    }
                });
                q.bD('FolderPasteMoveBasket', {
                    exec: function(w) {
                        if (a.bF && 1 == a.bs.indexOf(a.bF.substr(1, 1)) % 5 && a.lS(r) != a.lS(a.ed) || a.bF && a.bF.substr(3, 1) != a.bs.substr((a.bs.indexOf(a.bF.substr(0, 1)) + a.bs.indexOf(a.bF.substr(2, 1))) * 9 % (a.bs.length - 1), 1)) w.msgDialog('', "\x54\150\151\x73\040\146\165\156\x63\x74\x69\x6f\x6e\x20\151\x73\040\x64\151\163\x61\142\x6c\x65\x64\x20\151\156\x20\x74\x68\145\040\144\145\155\x6f\040\166\145\x72\x73\x69\x6f\x6e\x20\x6f\146\x20\103\x4b\x46\151\156\144\145\x72\x2e\x3c\142\162\040\057\076\x50\x6c\145\141\x73\x65\040\166\151\x73\151\164\x20\164\150\145\040\x3c\141\040\150\162\x65\x66\x3d\047\150\164\x74\x70\072\x2f\x2f\143\153\x73\157\x75\x72\x63\x65\x2e\x63\x6f\155\057\x63\x6b\146\151\156\x64\x65\162\x27\x3e\x43\113\106\x69\156\144\x65\162\x20\167\x65\142\040\x73\x69\x74\145\x3c\x2f\x61\x3e\x20\x74\157\040\157\x62\x74\141\151\x6e\040\x61\x20\x76\x61\x6c\x69\144\x20\154\151\143\x65\x6e\163\145\x2e");
                        else {
                            var x = w.aV;
                            if (!x) return;
                            p(w, x, w.basketFiles, true);
                            t();
                        }
                    }
                });
                q.eU({
                    folderPasteMoveBasket: {
                        label: q.lang.BasketMoveFilesHere,
                        command: 'FolderPasteMoveBasket',
                        group: 'folder1'
                    },
                    folderPasteCopyBasket: {
                        label: q.lang.BasketCopyFilesHere,
                        command: 'FolderPasteCopyBasket',
                        group: 'folder1'
                    }
                });
                var u = q.basket = new a.aL.BasketFolder(q);
                q.basketFiles = [];
                q.on('uiReady', function D(w) {
                    var x = q.aG['foldertree.foldertree'];
                    x.on('beforeAddFolder', function F(E) {
                        E.removeListener();
                        E.data.folders.push(u);
                    });
                    x.on('beforeDroppable', function L(E) {
                        if (!(E.data.target instanceof a.aL.BasketFolder)) return;
                        if (E.data.source instanceof a.aL.File) E.data.source = [E.data.source];
                        if (!i.isArray(E.data.source) || !E.data.source.length || !(E.data.source[0] instanceof a.aL.File)) return;
                        var F = E.data.source,
                            G = 0;
                        for (var H = 0, I = F.length, J, K; H < I; H++) {
                            for (J = 0, K = q.basketFiles.length; J < K; J++) {
                                if (F[H].isSameFile(q.basketFiles[J])) {
                                    G = 1;
                                    break;
                                }
                            }
                            if (!G) q.basketFiles.push(F[H]);
                        }
                        E.cancel(1);
                    });
                    x.on('beforeContextMenu', function G(E) {
                        var F;
                        if (!(E.data.folder instanceof a.aL.BasketFolder)) {
                            F = E.data.bj;
                            F.folderPasteCopyBasket = q.basketFiles.length ? a.aS : a.aY;
                            F.folderPasteMoveBasket = q.basketFiles.length ? a.aS : a.aY;
                        } else {
                            F = E.data.bj;
                            delete F.lI;
                            delete F.removeFolder;
                            delete F.kl;
                            F.qT = q.basketFiles.length ? a.aS : a.aY;
                        }
                    });
                    x.on('beforeKeyboardNavigation', function G(E) {
                        if (E.data.folder instanceof a.aL.BasketFolder) {
                            var F = E.data.db();
                            if (F == 46 || F == 113) E.cancel();
                        }
                    });
                    q.bD('TruncateBasket', {
                        exec: function(E) {
                            if (E.basketFiles.length) E.fe('', E.lang.BasketTruncateConfirm, function() {
                                E.basketFiles.length = 0;
                                E.oW('requestSelectFolder', {
                                    folder: E.basket
                                });
                            });
                        }
                    });
                    q.bD('RemoveFileFromBasket', {
                        exec: function(E) {
                            var F = E.aG['filesview.filesview'].tools.oO();
                            if (F && F.length) E.fe('', F.length == 1 ? E.lang.BasketRemoveConfirm.replace('%1', F[0].name) : E.lang.BasketRemoveConfirmMultiple.replace('%1', F.length), function() {
                                for (var G = 0, H = F.length, I; G < H; G++) for (I = 0; I < E.basketFiles.length; I++) {
                                    if (F[G].isSameFile(E.basketFiles[I])) {
                                        E.basketFiles.splice(I, 1);
                                        break;
                                    }
                                }
                                E.oW('requestSelectFolder', {
                                    folder: E.basket
                                });
                                t();
                            });
                        }
                    });
                    q.bD('OpenFileFolder', {
                        exec: function(E) {
                            var F = E.aG['filesview.filesview'].data().cG;
                            if (F) E.oW('requestSelectFolder', {
                                folder: F.folder
                            });
                        }
                    });
                    if (q.eU) q.gp('truncateBasket', {
                        label: q.lang.BasketClear,
                        command: 'TruncateBasket',
                        group: 'folder'
                    });
                    var y = [],
                        z = q.aG['filesview.filesview'],
                        A = [];
                    z.on('beforeContextMenu', function(E) {
                        if (!(E.data.folder instanceof a.aL.BasketFolder)) return;
                        var F = E.data.bj;
                        delete F.renameFile;
                        delete F.deleteFile;
                        delete F.deleteFiles;
                        F.mu = a.aS;
                        F.hN = a.aS;
                        for (var G = 0; G < A.length; G++) F[A[G]] = a.aS;
                    });
                    z.on('beforeShowFolderFiles', function N(E) {
                        if (!(E.data.folder instanceof a.aL.BasketFolder)) return;
                        E.cancel(1);
                        this.app.oW('requestRenderFiles', {
                            files: q.basketFiles,
                            mj: q.lang.BasketEmpty,
                            eu: 1,
                            folder: E.data.folder
                        });
                        this.app.oW('requestRepaintFolder', E.data);
                        B(this.app);
                        C(this.app);
                        t();
                        var F = this.app.dh.fk;
                        for (var G = 0; G < F.length; G++) {
                            var H = this.app.document.getById(F[G].id),
                                I = ['<span class="cke_toolgroup" id="basket">'];
                            for (var J in this.app.bY._.items) {
                                if (!this.app.bY._.items.hasOwnProperty(J)) continue;
                                var K = q.bY._.items[J];
                                if (!K.mp[0].basketToolbar) continue;
                                K = q.bY.create(J);
                                var L = K.er(q, I),
                                    M = F[G].items.push(L) - 1;
                                if (M > 0) {
                                    L.previous = F[G].items[M - 1];
                                    L.previous.next = L;
                                }
                                if (!y[G]) y[G] = [];
                                y[G].push(M);
                            }
                            I.push('</span>');
                            H.appendHtml(I.join(''));
                        }
                        this.on('beforeShowFolderFiles', function(O) {
                            this.app.document.getById('basket').remove();
                            var P = this.app.dh.fk;
                            for (var Q = 0; Q < P.length; Q++) for (var R = 0; R < P[Q].items.length; R++) {
                                if (y[Q][R]) delete P[Q].items[R];
                            }
                            O.removeListener();
                        }, null, null, 1);
                        this.oW('successShowFolderFiles', E.data);
                        this.oW('afterShowFolderFiles', E.data);
                    });
                    z.on('beforeKeyboardNavigation', function H(E) {
                        var F = q.aV;
                        if (F && F instanceof a.aL.BasketFolder) {
                            var G = E.data.db();
                            if (G == 46) {
                                E.cancel();
                                q.execCommand('RemoveFileFromBasket');
                            }
                            if (G == 113) E.cancel();
                        }
                    });

                    function B(E) {
                        for (var F in E.plugins) {
                            if (!E.plugins.hasOwnProperty(F)) continue;
                            F = E.plugins[F];
                            if (!F.basketToolbar) continue;
                            for (var G = 0; G < F.basketToolbar.length; G++) {
                                var H = F.basketToolbar[G];
                                if (E.bY._.items[H[0]]) continue;
                                var I = i.deepCopy(H[1]),
                                    J = I.command;
                                if (!I.command) {
                                    var K = H[1].onClick;
                                    J = 'BasketToolbar_' + H[0];
                                    E.bD(J, {
                                        exec: function(M) {
                                            K(M.cg);
                                        }
                                    });
                                    I.command = J;
                                }
                                var L = i.capitalize(F.name);
                                if (typeof I.label == 'function') I.label = I.label.call(F, E.cg);
                                else if (E.lang[F.name] && E.lang[F.name][I.label]) I.label = E.lang[F.name][I.label];
                                else if (E.lang[L] && E.lang[L][I.label]) I.label = E.lang[L][I.label];
                                else if (E.lang[I.label]) I.label = E.lang[I.label];
                                I.basketToolbar = 1;
                                if (I.disableEmpty) s.push(J);
                                E.bY.add(H[0], CKFinder._.UI_BUTTON, I);
                            }
                        }
                    };

                    function C(E) {
                        if (!E.eU) return;
                        for (var F in E.plugins) {
                            if (!E.plugins.hasOwnProperty(F)) continue;
                            F = E.plugins[F];
                            if (!F.basketFileContextMenu) continue;
                            for (var G = 0; G < F.basketFileContextMenu.length; G++) {
                                var H = F.basketFileContextMenu[G];
                                if (E._.iG[H[0]]) continue;
                                var I = i.deepCopy(H[1]);
                                if (!I.command) {
                                    var J = 'BasketContextMenu_' + H[0],
                                        K = H[1].onClick;
                                    E.bD('BasketContextMenu_' + H[0], {
                                        exec: function(M) {
                                            K(M.cg);
                                        }
                                    });
                                    I.command = J;
                                }
                                var L = i.capitalize(F.name);
                                if (typeof I.label == 'function') I.label = I.label.call(F, E.cg);
                                else if (E.lang[F.name] && E.lang[F.name][I.label]) I.label = E.lang[F.name][I.label];
                                else if (E.lang[L] && E.lang[L][I.label]) I.label = E.lang[L][I.label];
                                else if (E.lang[I.label]) I.label = E.lang[I.label];
                                if (I.disableEmpty) s.push(J);
                                E.gp(H[0], I);
                                A.push(H[0]);
                            }
                        }
                    };
                }, null, null, 20);
            }
        });
        a.aL.BasketFolder = i.createClass({
            $: function(q) {
                var r = this;
                a.aL.Folder.call(r, q, null, q.lang.BasketFolder);
                r.hasChildren = 0;
                r.acl = new a.aL.Acl('1111111');
                r.isBasket = true;
            },
            base: a.aL.Folder,
            ej: {
                createNewFolder: function() {},
                getChildren: function(q) {
                    q.apply(this, null);
                },
                rename: function() {},
                remove: function() {},
                getUrl: function() {
                    return 'ckfinder://basketFolder';
                },
                getUploadUrl: function() {
                    return null;
                },
                getPath: function() {
                    return '/';
                },
                copyFiles: function(q) {},
                moveFiles: function(q) {}
            }
        });
    })();
    a.DIALOG_RESIZE_NONE = 0;
    a.DIALOG_RESIZE_WIDTH = 1;
    a.DIALOG_RESIZE_HEIGHT = 2;
    a.DIALOG_RESIZE_BOTH = 3;
    (function() {
        function p(P) {
            return !!this._.tabs[P][0].$.offsetHeight;
        };

        function q() {
            var T = this;
            var P = T._.gx,
                Q = T._.cU.length,
                R = i.indexOf(T._.cU, P) + Q;
            for (var S = R - 1; S > R - Q; S--) {
                if (p.call(T, T._.cU[S % Q])) return T._.cU[S % Q];
            }
            return null;
        };

        function r() {
            var T = this;
            var P = T._.gx,
                Q = T._.cU.length,
                R = i.indexOf(T._.cU, P);
            for (var S = R + 1; S < R + Q; S++) {
                if (p.call(T, T._.cU[S % Q])) return T._.cU[S % Q];
            }
            return null;
        };
        a.dialog = function(P, Q) {
            var R = a.dialog._.ev[Q];
            R = i.extend(R(P), t);
            R = i.clone(R);
            R = new x(this, R);
            var S = a.document,
                T = P.theme.pu(P);
            this._ = {
                app: P,
                element: T.element,
                name: Q,
                hB: {
                    width: 0,
                    height: 0
                },
                size: {
                    width: 0,
                    height: 0
                },
                contents: {},
                buttons: {},
                iX: {},
                tabs: {},
                cU: [],
                gx: null,
                nM: null,
                gV: 0,
                qF: null,
                eC: false,
                eO: [],
                aW: 0,
                hasFocus: false
            };
            this.bO = T.bO;
            this.bO.dialog.setStyles({
                position: f.ie6Compat ? 'absolute' : 'fixed',
                top: 0,
                left: 0,
                visibility: 'hidden'
            });
            a.event.call(this);
            this.dg = R = a.oW('dialogDefinition', {
                name: Q,
                dg: R
            }, P).dg;
            if (R.onLoad) this.on('load', R.onLoad);
            if (R.onShow) this.on('show', R.onShow);
            if (R.onHide) this.on('hide', R.onHide);
            if (R.onOk) this.on('ok', function(fv) {
                if (R.onOk.call(this, fv) === false) fv.data.hide = false;
            });
            if (R.onCancel) this.on('cancel', function(fv) {
                if (R.onCancel.call(this, fv) === false) fv.data.hide = false;
            });
            var U = this,
                V = function(fv) {
                    var aP = U._.contents,
                        bV = false;
                    for (var eN in aP) for (var gB in aP[eN]) {
                        bV = fv.call(this, aP[eN][gB]);
                        if (bV) return;
                    }
                };
            this.on('ok', function(fv) {
                V(function(aP) {
                    if (aP.validate) {
                        var bV = aP.validate(this);
                        if (typeof bV == 'string') {
                            P.document.getWindow().$.alert(bV);
                            bV = false;
                        }
                        if (bV === false) {
                            if (aP.select) aP.select();
                            else aP.focus();
                            fv.data.hide = false;
                            fv.stop();
                            return true;
                        }
                    }
                });
            }, this, null, 0);
            this.on('cancel', function(fv) {
                V(function(aP) {
                    if (aP.isChanged()) {
                        if (!P.document.getWindow().$.confirm(P.lang.common.confirmCancel)) fv.data.hide = false;
                        return true;
                    }
                });
            }, this, null, 0);
            this.bO.close.on('click', function(fv) {
                if (this.oW('cancel', {
                    hide: true
                }).hide !== false) this.hide();
            }, this);

            function W(fv) {
                var aP = U._.eO,
                    bV = fv ? 1 : -1;
                if (aP.length < 1) return;
                var eN = (U._.aW + bV + aP.length) % aP.length,
                    gB = eN;
                while (!aP[gB].fM()) {
                    gB = (gB + bV + aP.length) % aP.length;
                    if (gB == eN) break;
                }
                aP[gB].focus();
                if (aP[gB].type == 'text') aP[gB].select();
            };
            var X;

            function Y(fv) {
                if (U != a.dialog._.dL) return;
                var aP = fv.data.db();
                X = 0;
                if (aP == 9 || aP == a.dy + 9) {
                    var bV = aP == a.dy + 9;
                    if (U._.eC) {
                        var eN = bV ? q.call(U) : r.call(U);
                        U.selectPage(eN);
                        U._.tabs[eN][0].focus();
                    } else W(!bV);
                    X = 1;
                } else if (aP == a.eJ + 121 && !U._.eC) {
                    U._.eC = true;
                    U._.tabs[U._.gx][0].focus();
                    X = 1;
                } else if ((aP == 37 || aP == 39) && U._.eC) {
                    eN = aP == 37 ? q.call(U) : r.call(U);
                    U.selectPage(eN);
                    U._.tabs[eN][0].focus();
                    X = 1;
                }
                if (X) {
                    fv.stop();
                    fv.data.preventDefault();
                }
            };

            function Z(fv) {
                X && fv.data.preventDefault();
            };
            this.on('show', function() {
                a.document.on('keydown', Y, this, null, 0);
                if (f.opera || f.gecko && f.mac) a.document.on('keypress', Z, this);
                if (f.ie6Compat) {
                    var fv = C.getChild(0).getFrameDocument();
                    fv.on('keydown', Y, this, null, 0);
                }
            });
            this.on('hide', function() {
                a.document.removeListener('keydown', Y);
                if (f.opera || f.gecko && f.mac) a.document.removeListener('keypress', Z);
            });
            this.on('iframeAdded', function(fv) {
                var aP = new j(fv.data.iframe.$.contentWindow.document);
                aP.on('keydown', Y, this, null, 0);
            });
            this.on('show', function() {
                if (!this._.hasFocus) {
                    this._.aW = -1;
                    W(true);
                }
            }, this, null, 4294967295);
            if (f.ie6Compat) this.on('load', function(fv) {
                var aP = this.getElement(),
                    bV = aP.getFirst();
                bV.remove();
                bV.appendTo(aP);
            }, this);
            z(this);
            A(this);
            this.bO.title.setText(R.title);
            for (var aa = 0; aa < R.contents.length; aa++) this.addPage(R.contents[aa]);
            var aT = /cke_dialog_tab(\s|$|_)/,
                bm = /cke_dialog_tab(\s|$)/;
            this.bO.tabs.on('click', function(fv) {
                var dX = this;
                var aP = fv.data.bK(),
                    bV = aP,
                    eN, gB;
                if (!(aT.test(aP.$.className) || aP.getName() == 'a')) return;
                eN = aP.$.id.substr(0, aP.$.id.lastIndexOf('_'));
                dX.selectPage(eN);
                if (dX._.eC) {
                    dX._.eC = false;
                    dX._.aW = -1;
                    W(true);
                }
                fv.data.preventDefault();
            }, this);
            var bW = [],
                eS = a.dialog._.gv.hbox.dQ(this, {
                    type: 'hbox',
                    className: 'cke_dialog_footer_buttons',
                    widths: [],
                    children: R.buttons
                }, bW).getChild();
            this.bO.footer.setHtml(bW.join(''));
            for (aa = 0; aa < eS.length; aa++) this._.buttons[eS[aa].id] = eS[aa];
            a.skins.load(P, 'dialog');
        };

        function s(P, Q, R) {
            this.element = Q;
            this.cQ = R;
            this.fM = function() {
                return !Q.getAttribute('disabled') && Q.isVisible();
            };
            this.focus = function() {
                P._.aW = this.cQ;
                this.element.focus();
            };
            Q.on('keydown', function(S) {
                if (S.data.db() in {
                    32: 1,
                    13: 1
                }) this.oW('click');
            });
            Q.on('focus', function() {
                this.oW('mouseover');
            });
            Q.on('blur', function() {
                this.oW('mouseout');
            });
        };
        a.dialog.prototype = {
            resize: (function() {
                return function(P, Q) {
                    var R = this;
                    if (R._.hB && R._.hB.width == P && R._.hB.height == Q) return;
                    a.dialog.oW('resize', {
                        dialog: R,
                        skin: R._.app.gd,
                        width: P,
                        height: Q
                    }, R._.app);
                    R._.hB = {
                        width: P,
                        height: Q
                    };
                };
            })(),
            hR: function() {
                var P = this._.element.getFirst();
                return {
                    width: P.$.offsetWidth || 0,
                    height: P.$.offsetHeight || 0
                };
            },
            mn: function() {
                var P = this.hR();
                P.height = P.height - (this.bO.title.$.offsetHeight || 0) - (this.bO.footer.$.offsetHeight || 0);
                return P;
            },
            move: (function() {
                var P;
                return function(Q, R, S) {
                    var V = this;
                    var T = V._.element.getFirst();
                    if (P === undefined) P = T.getComputedStyle('position') == 'fixed';
                    if (P && V._.position && V._.position.x == Q && V._.position.y == R) return;
                    V._.position = {
                        x: Q,
                        y: R
                    };
                    if (!P) {
                        var U = a.document.getWindow().hV();
                        Q += U.x;
                        R += U.y;
                    }
                    T.setStyles({
                        left: (Q > 0 ? Q : 0) + 'px',
                        top: (R > 0 ? R : 0) + 'px'
                    });
                    S && (V._.moved = 1);
                };
            })(),
            gz: function() {
                return i.extend({}, this._.position);
            },
            show: function() {
                var P = this._.app;
                if (P.mode == 'qt' && g) {
                    var Q = P.getSelection();
                    Q && Q.up();
                }
                var R = this._.element,
                    S = this.dg;
                if (!(R.getParent() && R.getParent().equals(a.document.bH()))) R.appendTo(a.document.bH());
                else return;
                if (f.gecko && f.version < 10900) {
                    var T = this.bO.dialog;
                    T.setStyle('position', 'absolute');
                    setTimeout(function() {
                        T.setStyle('position', 'fixed');
                    }, 0);
                }
                this.resize(this._.hB && this._.hB.width || S.minWidth, this._.hB && this._.hB.height || S.minHeight);
                this.selectPage(this.dg.contents[0].id);
                this.reset();
                if (a.dialog._.gw === null) a.dialog._.gw = this._.app.config.baseFloatZIndex;
                this._.element.getFirst().setStyle('z-index', a.dialog._.gw += 10);
                if (a.dialog._.dL === null) {
                    a.dialog._.dL = this;
                    this._.ep = null;
                    D(this._.app);
                    R.on('keydown', G);
                    R.on(f.opera ? 'keypress' : 'keyup', H);
                    for (var U in {
                        keyup: 1,
                        keydown: 1,
                        keypress: 1
                    }) R.on(U, N);
                } else {
                    this._.ep = a.dialog._.dL;
                    var V = this._.ep.getElement().getFirst();
                    V.$.style.zIndex -= Math.floor(this._.app.config.baseFloatZIndex / 2);
                    a.dialog._.dL = this;
                }
                I(this, this, '\x1b', null, function() {
                    var W = this.getButton('cancel');
                    if (W) W.click();
                    else if (this.oW('cancel', {
                        hide: true
                    }).hide !== false) this.hide();
                });
                this._.hasFocus = false;
                i.setTimeout(function() {
                    this.layout();
                    this.bO.dialog.setStyle('visibility', '');
                    this.cr('load', {});
                    this.oW('show', {});
                    this._.app.oW('dialogShow', this);
                    this.gh(function(W) {
                        W.jW && W.jW();
                    });
                }, 100, this);
            },
            layout: function() {
                var R = this;
                var P = a.document.getWindow().eR(),
                    Q = R.hR();
                R.move(R._.moved ? R._.position.x : (P.width - Q.width) / 2, R._.moved ? R._.position.y : (P.height - Q.height) / 2);
            },
            gh: function(P) {
                var S = this;
                for (var Q in S._.contents) for (var R in S._.contents[Q]) P(S._.contents[Q][R]);
                return S;
            },
            reset: (function() {
                var P = function(Q) {
                    if (Q.reset) Q.reset();
                };
                return function() {
                    this.gh(P);
                    return this;
                };
            })(),
            rN: function() {
                var P = arguments;
                this.gh(function(Q) {
                    if (Q.qi) Q.qi.apply(Q, P);
                });
            },
            sI: function() {
                var P = arguments;
                this.gh(function(Q) {
                    if (Q.rx) Q.rx.apply(Q, P);
                });
            },
            hide: function() {
                this.oW('hide', {});
                this._.app.oW('dialogHide', this);
                var P = this._.element;
                if (!P.getParent()) return;
                P.remove();
                this.bO.dialog.setStyle('visibility', 'hidden');
                J(this);
                if (!this._.ep) E();
                else {
                    var Q = this._.ep.getElement().getFirst();
                    Q.setStyle('z-index', parseInt(Q.$.style.zIndex, 10) + Math.floor(this._.app.config.baseFloatZIndex / 2));
                }
                a.dialog._.dL = this._.ep;
                if (!this._.ep) {
                    a.dialog._.gw = null;
                    P.removeListener('keydown', G);
                    P.removeListener(f.opera ? 'keypress' : 'keyup', H);
                    for (var R in {
                        keyup: 1,
                        keydown: 1,
                        keypress: 1
                    }) P.removeListener(R, N);
                    var S = this._.app;
                    S.focus();
                    S._.activeElement = null;
                    S._.oO = [];
                    if (S.mode == 'qt' && g) {
                        var T = S.getSelection();
                        T && T.sd(true);
                    }
                } else a.dialog._.gw -= 10;
                this.gh(function(U) {
                    U.ki && U.ki();
                });
            },
            addPage: function(P) {
                var Z = this;
                var Q = [],
                    R = P.label ? ' title="' + i.htmlEncode(P.label) + '"' : '',
                    S = P.elements,
                    T = a.dialog._.gv.vbox.dQ(Z, {
                        type: 'vbox',
                        className: 'cke_dialog_page_contents',
                        children: P.elements,
                        expand: !!P.expand,
                        padding: P.padding,
                        style: P.style || 'width: 100%; height: 100%;'
                    }, Q),
                    U = k.kE(Q.join(''), a.document),
                    V = k.kE(['<a class="cke_dialog_tab"', Z._.gV > 0 ? ' cke_last' : 'cke_first', R, !!P.hidden ? ' style="display:none"' : '', ' id="', P.id + '_', i.getNextNumber(), '" href="javascript:void(0)"', ' hp="true">', P.label, '</a>'].join(''), a.document);
                if (Z._.gV === 0) Z.bO.dialog.addClass('cke_single_page');
                else Z.bO.dialog.removeClass('cke_single_page');
                Z._.tabs[P.id] = [V, U];
                Z._.cU.push(P.id);
                Z._.gV++;
                Z._.qF = V;
                var W = Z._.contents[P.id] = {},
                    X, Y = T.getChild();
                while (X = Y.shift()) {
                    W[X.id] = X;
                    if (typeof X.getChild == 'function') Y.push.apply(Y, X.getChild());
                }
                U.setAttribute('name', P.id);
                U.appendTo(Z.bO.contents);
                V.unselectable();
                Z.bO.tabs.append(V);
                if (P.accessKey) {
                    I(Z, Z, 'bP+' + P.accessKey, L, K);
                    Z._.iX['bP+' + P.accessKey] = P.id;
                }
            },
            selectPage: function(P) {
                var U = this;
                for (var Q in U._.tabs) {
                    var R = U._.tabs[Q][0],
                        S = U._.tabs[Q][1];
                    if (Q != P) {
                        R.removeClass('cke_dialog_tab_selected');
                        S.hide();
                    }
                }
                var T = U._.tabs[P];
                T[0].addClass('cke_dialog_tab_selected');
                T[1].show();
                U._.gx = P;
                U._.nM = i.indexOf(U._.cU, P);
            },
            vJ: function(P) {
                var Q = this._.tabs[P] && this._.tabs[P][0];
                if (!Q) return;
                Q.hide();
            },
            showPage: function(P) {
                var Q = this._.tabs[P] && this._.tabs[P][0];
                if (!Q) return;
                Q.show();
            },
            getElement: function() {
                return this._.element;
            },
            getName: function() {
                return this._.name;
            },
            getContentElement: function(P, Q) {
                return this._.contents[P][Q];
            },
            getValueOf: function(P, Q) {
                return this.getContentElement(P, Q).getValue();
            },
            setValueOf: function(P, Q, R) {
                return this.getContentElement(P, Q).setValue(R);
            },
            getButton: function(P) {
                return this._.buttons[P];
            },
            click: function(P) {
                return this._.buttons[P].click();
            },
            disableButton: function(P) {
                return this._.buttons[P].disable();
            },
            enableButton: function(P) {
                return this._.buttons[P].enable();
            },
            vj: function() {
                return this._.gV;
            },
            getParentApi: function() {
                return this._.app.cg;
            },
            eY: function() {
                return this._.app;
            },
            rf: function() {
                return this.eY().getSelection().rf();
            },
            tQ: function(P, Q) {
                var S = this;
                if (typeof Q == 'undefined') {
                    Q = S._.eO.length;
                    S._.eO.push(new s(S, P, Q));
                } else {
                    S._.eO.splice(Q, 0, new s(S, P, Q));
                    for (var R = Q + 1; R < S._.eO.length; R++) S._.eO[R].cQ++;
                }
            },
            setTitle: function(P) {
                this.bO.title.setText(P);
            }
        };
        i.extend(a.dialog, {
            add: function(P, Q) {
                if (!this._.ev[P] || typeof Q == 'function') this._.ev[P] = Q;
            },
            exists: function(P) {
                return !!this._.ev[P];
            },
            getCurrent: function() {
                return a.dialog._.dL;
            },
            okButton: (function() {
                var P = function(Q, R) {
                    R = R || {};
                    return i.extend({
                        id: 'ok',
                        type: 'button',
                        label: Q.lang.common.ok,
                        'class': 'cke_dialog_ui_button_ok',
                        onClick: function(S) {
                            var T = S.data.dialog;
                            if (T.oW('ok', {
                                hide: true
                            }).hide !== false) T.hide();
                        }
                    }, R, true);
                };
                P.type = 'button';
                P.override = function(Q) {
                    return i.extend(function(R) {
                        return P(R, Q);
                    }, {
                        type: 'button'
                    }, true);
                };
                return P;
            })(),
            cancelButton: (function() {
                var P = function(Q, R) {
                    R = R || {};
                    return i.extend({
                        id: 'cancel',
                        type: 'button',
                        label: Q.lang.common.cancel,
                        'class': 'cke_dialog_ui_button_cancel',
                        onClick: function(S) {
                            var T = S.data.dialog;
                            if (T.oW('cancel', {
                                hide: true
                            }).hide !== false) T.hide();
                        }
                    }, R, true);
                };
                P.type = 'button';
                P.override = function(Q) {
                    return i.extend(function(R) {
                        return P(R, Q);
                    }, {
                        type: 'button'
                    }, true);
                };
                return P;
            })(),
            addUIElement: function(P, Q) {
                this._.gv[P] = Q;
            }
        });
        a.dialog._ = {
            gv: {},
            ev: {},
            dL: null,
            gw: null
        };
        a.event.du(a.dialog);
        a.event.du(a.dialog.prototype, true);
        var t = {
                resizable: a.DIALOG_RESIZE_NONE,
                minWidth: 600,
                minHeight: 400,
                buttons: [a.dialog.okButton, a.dialog.cancelButton]
            },
            u = function(P, Q, R) {
                for (var S = 0, T; T = P[S]; S++) {
                    if (T.id == Q) return T;
                    if (R && T[R]) {
                        var U = u(T[R], Q, R);
                        if (U) return U;
                    }
                }
                return null;
            },
            v = function(P, Q, R, S, T) {
                if (R) {
                    for (var U = 0, V; V = P[U]; U++) {
                        if (V.id == R) {
                            P.splice(U, 0, Q);
                            return Q;
                        }
                        if (S && V[S]) {
                            var W = v(V[S], Q, R, S, true);
                            if (W) return W;
                        }
                    }
                    if (T) return null;
                }
                P.push(Q);
                return Q;
            },
            w = function(P, Q, R) {
                for (var S = 0, T; T = P[S]; S++) {
                    if (T.id == Q) return P.splice(S, 1);
                    if (R && T[R]) {
                        var U = w(T[R], Q, R);
                        if (U) return U;
                    }
                }
                return null;
            },
            x = function(P, Q) {
                this.dialog = P;
                var R = Q.contents;
                for (var S = 0, T; T = R[S]; S++) R[S] = new y(P, T);
                i.extend(this, Q);
            };
        x.prototype = {
            vz: function(P) {
                return u(this.contents, P);
            },
            getButton: function(P) {
                return u(this.buttons, P);
            },
            uh: function(P, Q) {
                return v(this.contents, P, Q);
            },
            qW: function(P, Q) {
                return v(this.buttons, P, Q);
            },
            uP: function(P) {
                w(this.contents, P);
            },
            uO: function(P) {
                w(this.buttons, P);
            }
        };

        function y(P, Q) {
            this._ = {
                dialog: P
            };
            i.extend(this, Q);
        };
        y.prototype = {
            eB: function(P) {
                return u(this.elements, P, 'children');
            },
            add: function(P, Q) {
                return v(this.elements, P, Q, 'children');
            },
            remove: function(P) {
                w(this.elements, P, 'children');
            }
        };

        function z(P) {
            var Q = null,
                R = null,
                S = P.getElement().getFirst(),
                T = P.eY(),
                U = T.config.dialog_magnetDistance,
                V = T.skin.margins || [0, 0, 0, 0];
            if (typeof U == 'undefined') U = 20;

            function W(Y) {
                var Z = P.hR(),
                    aa = a.document.getWindow().eR(),
                    aT = Y.data.$.screenX,
                    bm = Y.data.$.screenY,
                    bW = aT - Q.x,
                    eS = bm - Q.y,
                    fv, aP;
                Q = {
                    x: aT,
                    y: bm
                };
                R.x += bW;
                R.y += eS;
                if (R.x + V[3] < U) fv = -V[3];
                else if (R.x - V[1] > aa.width - Z.width - U) fv = aa.width - Z.width + V[1];
                else fv = R.x;
                if (R.y + V[0] < U) aP = -V[0];
                else if (R.y - V[2] > aa.height - Z.height - U) aP = aa.height - Z.height + V[2];
                else aP = R.y;
                P.move(fv, aP, 1);
                Y.data.preventDefault();
            };

            function X(Y) {
                a.document.removeListener('mousemove', W);
                a.document.removeListener('mouseup', X);
                if (f.ie6Compat) {
                    var Z = C.getChild(0).getFrameDocument();
                    Z.removeListener('mousemove', W);
                    Z.removeListener('mouseup', X);
                }
            };
            P.bO.title.on('mousedown', function(Y) {
                Q = {
                    x: Y.data.$.screenX,
                    y: Y.data.$.screenY
                };
                a.document.on('mousemove', W);
                a.document.on('mouseup', X);
                R = P.gz();
                if (f.ie6Compat) {
                    var Z = C.getChild(0).getFrameDocument();
                    Z.on('mousemove', W);
                    Z.on('mouseup', X);
                }
                Y.data.preventDefault();
            }, P);
        };

        function A(P) {
            var Q = P.dg,
                R = Q.resizable;
            if (R == a.DIALOG_RESIZE_NONE) return;
            var S = P.eY(),
                T, U, V, W, X, Y;

            function Z(bW) {
                if (P._.moved && S.lang.dir == 'rtl') {
                    var eS = P._.element.getFirst();
                    eS.setStyle('right', bW + 'px');
                    eS.removeStyle('left');
                } else if (!P._.moved) P.layout();
            };

            function aa(bW) {
                X = P.hR();
                bW = bW.data.$;
                var eS = P.bO.contents,
                    fv = eS.$.getElementsByTagName('iframe').length;
                if (fv) {
                    Y = k.kE('<div class="cke_dialog_resize_cover" style="height: 100%; position: absolute; width: 100%;"></div>');
                    eS.append(Y);
                }
                U = X.height - P.bO.contents.hR('height', !(f.gecko || f.opera || g && f.quirks));
                T = X.width - P.bO.contents.hR('width', 1);
                W = {
                    x: bW.screenX,
                    y: bW.screenY
                };
                V = a.document.getWindow().eR();
                a.document.on('mousemove', aT);
                a.document.on('mouseup', bm);
                if (f.ie6Compat) {
                    var aP = C.getChild(0).getFrameDocument();
                    aP.on('mousemove', aT);
                    aP.on('mouseup', bm);
                }
                bW.preventDefault && bW.preventDefault();
            };
            P.on('load', function() {
                var bW = '';
                if (R == a.DIALOG_RESIZE_WIDTH) bW = ' cke_resizer_horizontal';
                else if (R == a.DIALOG_RESIZE_HEIGHT) bW = ' cke_resizer_vertical';
                var eS = k.kE('<div class="cke_resizer' + bW + '"' + ' title="' + i.htmlEncode(S.lang.resize) + '"></div>');
                eS.on('mousedown', aa);
                P.bO.footer.append(eS, 1);
            });
            S.on('destroy', function() {
                i.removeFunction(aa);
            });

            function aT(bW) {
                var eS = S.lang.dir == 'rtl',
                    fv = (bW.data.$.screenX - W.x) * (eS ? -1 : 1),
                    aP = bW.data.$.screenY - W.y,
                    bV = X.width,
                    eN = X.height,
                    gB = bV + fv * (P._.moved ? 1 : 2),
                    dX = eN + aP * (P._.moved ? 1 : 2),
                    gs = P._.element.getFirst(),
                    am = eS && gs.getComputedStyle('right'),
                    gP = P.gz();
                if (am) am = am == 'auto' ? V.width - (gP.x || 0) - gs.hR('width') : parseInt(am, 10);
                if (gP.y + dX > V.height) dX = V.height - gP.y;
                if ((eS ? am : gP.x) + gB > V.width) gB = V.width - (eS ? am : gP.x);
                if ((R == a.DIALOG_RESIZE_WIDTH || R == a.DIALOG_RESIZE_BOTH) && !(eS && fv > 0 && !gP.x)) bV = Math.max(Q.minWidth || 0, gB - T);
                if (R == a.DIALOG_RESIZE_HEIGHT || R == a.DIALOG_RESIZE_BOTH) eN = Math.max(Q.minHeight || 0, dX - U);
                P.resize(bV, eN);
                Z(am);
                bW.data.preventDefault();
            };

            function bm() {
                a.document.removeListener('mouseup', bm);
                a.document.removeListener('mousemove', aT);
                if (Y) {
                    Y.remove();
                    Y = null;
                }
                if (f.ie6Compat) {
                    var bW = C.getChild(0).getFrameDocument();
                    bW.removeListener('mouseup', bm);
                    bW.removeListener('mousemove', aT);
                }
                if (S.lang.dir == 'rtl') {
                    var eS = P._.element.getFirst(),
                        fv = eS.getComputedStyle('left');
                    if (fv == 'auto') fv = V.width - parseInt(eS.rd('right'), 10) - P.hR().width;
                    else fv = parseInt(fv, 10);
                    eS.removeStyle('right');
                    P._.position.x += 1;
                    P.move(fv, P._.position.y);
                }
            };
        };
        var B, C, D = function(P) {
                var Q = a.document.getWindow();
                if (!C) {
                    var R = P.config.dialog_backgroundCoverColor || 'white',
                        S = ['<div style="position: ', f.ie6Compat ? 'absolute' : 'fixed', '; z-index: ', P.config.baseFloatZIndex, '; top: 0px; left: 0px; ', !f.ie6Compat ? 'background-color: ' + R : '', '" id="cke_dialog_background_cover">'];
                    if (f.ie6Compat) {
                        var T = f.isCustomDomain(),
                            U = "<html><body style=\\'background-color:" + R + ";\\'></body></html>";
                        S.push('<iframe hp="true" frameborder="0" id="cke_dialog_background_iframe" src="javascript:');
                        S.push('void((function(){document.open();' + (T ? "document.domain='" + document.domain + "';" : '') + "document.write( '" + U + "' );" + 'document.close();' + '})())');
                        S.push('" style="position:absolute;left:0;top:0;width:100%;height: 100%;progid:DXImageTransform.Microsoft.Alpha(opacity=0)"></iframe>');
                    }
                    S.push('</div>');
                    C = k.kE(S.join(''), a.document);
                }
                var V = C,
                    W = function() {
                        var aa = Q.eR();
                        V.setStyles({
                            width: aa.width + 'px',
                            height: aa.height + 'px'
                        });
                    },
                    X = function() {
                        var aa = Q.hV(),
                            aT = a.dialog._.dL;
                        V.setStyles({
                            left: aa.x + 'px',
                            top: aa.y + 'px'
                        });
                        do {
                            var bm = aT.gz();
                            aT.move(bm.x, bm.y);
                        } while (aT = aT._.ep);
                    };
                B = W;
                Q.on('resize', W);
                W();
                if (f.ie6Compat) {
                    var Y = function() {
                        X();
                        arguments.callee.lw.apply(this, arguments);
                    };
                    Q.$.setTimeout(function() {
                        Y.lw = window.onscroll || (function() {});
                        window.onscroll = Y;
                    }, 0);
                    X();
                }
                var Z = P.config.dialog_backgroundCoverOpacity;
                V.setOpacity(typeof Z != 'undefined' ? Z : 0.5);
                V.appendTo(a.document.bH());
            },
            E = function() {
                if (!C) return;
                var P = a.document.getWindow();
                C.remove();
                P.removeListener('resize', B);
                if (f.ie6Compat) P.$.setTimeout(function() {
                    var Q = window.onscroll && window.onscroll.lw;
                    window.onscroll = Q || null;
                }, 0);
                B = null;
            },
            F = {},
            G = function(P) {
                var Q = P.data.$.ctrlKey || P.data.$.metaKey,
                    R = P.data.$.altKey,
                    S = P.data.$.shiftKey,
                    T = String.fromCharCode(P.data.$.keyCode),
                    U = F[(Q ? 'bP+' : '') + (R ? 'eJ+' : '') + (S ? 'dy+' : '') + T];
                if (!U || !U.length) return;
                U = U[U.length - 1];
                U.keydown && U.keydown.call(U.bf, U.dialog, U.iK);
                P.data.preventDefault();
            },
            H = function(P) {
                var Q = P.data.$.ctrlKey || P.data.$.metaKey,
                    R = P.data.$.altKey,
                    S = P.data.$.shiftKey,
                    T = String.fromCharCode(P.data.$.keyCode),
                    U = F[(Q ? 'bP+' : '') + (R ? 'eJ+' : '') + (S ? 'dy+' : '') + T];
                if (!U || !U.length) return;
                U = U[U.length - 1];
                if (U.keyup) {
                    U.keyup.call(U.bf, U.dialog, U.iK);
                    P.data.preventDefault();
                }
            },
            I = function(P, Q, R, S, T) {
                var U = F[R] || (F[R] = []);
                U.push({
                    bf: P,
                    dialog: Q,
                    iK: R,
                    keyup: T || P.eZ,
                    keydown: S || P.iU
                });
            },
            J = function(P) {
                for (var Q in F) {
                    var R = F[Q];
                    for (var S = R.length - 1; S >= 0; S--) {
                        if (R[S].dialog == P || R[S].bf == P) R.splice(S, 1);
                    }
                    if (R.length === 0) delete F[Q];
                }
            },
            K = function(P, Q) {
                if (P._.iX[Q]) P.selectPage(P._.iX[Q]);
            },
            L = function(P, Q) {},
            M = {
                27: 1,
                13: 1
            },
            N = function(P) {
                if (P.data.db() in M) P.data.stopPropagation();
            };
        (function() {
            n.dialog = {
                bf: function(P, Q, R, S, T, U, V) {
                    if (arguments.length < 4) return;
                    var W = (S.call ? S(Q) : S) || 'div',
                        X = ['<', W, ' '],
                        Y = (T && T.call ? T(Q) : T) || {},
                        Z = (U && U.call ? U(Q) : U) || {},
                        aa = (V && V.call ? V(P, Q) : V) || '',
                        aT = this.oJ = Z.id || i.getNextNumber() + '_uiElement',
                        bm = this.id = Q.id,
                        bW;
                    Z.id = aT;
                    var eS = {};
                    if (Q.type) eS['cke_dialog_ui_' + Q.type] = 1;
                    if (Q.className) eS[Q.className] = 1;
                    var fv = Z['class'] && Z['class'].split ? Z['class'].split(' ') : [];
                    for (bW = 0; bW < fv.length; bW++) {
                        if (fv[bW]) eS[fv[bW]] = 1;
                    }
                    var aP = [];
                    for (bW in eS) aP.push(bW);
                    Z['class'] = aP.join(' ');
                    if (Q.title) Z.title = Q.title;
                    var bV = (Q.style || '').split(';');
                    for (bW in Y) bV.push(bW + ':' + Y[bW]);
                    if (Q.hidden) bV.push('display:none');
                    for (bW = bV.length - 1; bW >= 0; bW--) {
                        if (bV[bW] === '') bV.splice(bW, 1);
                    }
                    if (bV.length > 0) Z.style = (Z.style ? Z.style + '; ' : '') + bV.join('; ');
                    for (bW in Z) X.push(bW + '="' + i.htmlEncode(Z[bW]) + '" ');
                    X.push('>', aa, '</', W, '>');
                    R.push(X.join(''));
                    (this._ || (this._ = {})).dialog = P;
                    if (typeof Q.isChanged == 'boolean') this.isChanged = function() {
                        return Q.isChanged;
                    };
                    if (typeof Q.isChanged == 'function') this.isChanged = Q.isChanged;
                    a.event.du(this);
                    this.nc(Q);
                    if (this.eZ && this.iU && Q.accessKey) I(this, P, 'bP+' + Q.accessKey);
                    var eN = this;
                    P.on('load', function() {
                        if (eN.getInputElement()) eN.getInputElement().on('focus', function() {
                            P._.eC = false;
                            P._.hasFocus = true;
                            eN.oW('focus');
                        }, eN);
                    });
                    if (this.eA) {
                        this.cQ = P._.eO.push(this) - 1;
                        this.on('focus', function() {
                            P._.aW = eN.cQ;
                        });
                    }
                    i.extend(this, Q);
                },
                hbox: function(P, Q, R, S, T) {
                    if (arguments.length < 4) return;
                    this._ || (this._ = {});
                    var U = this._.children = Q,
                        V = T && T.widths || null,
                        W = T && T.height || null,
                        X = {},
                        Y, Z = function() {
                            var aa = ['<tbody><tr class="cke_dialog_ui_hbox">'];
                            for (Y = 0; Y < R.length; Y++) {
                                var aT = 'cke_dialog_ui_hbox_child',
                                    bm = [];
                                if (Y === 0) aT = 'cke_dialog_ui_hbox_first';
                                if (Y == R.length - 1) aT = 'cke_dialog_ui_hbox_last';
                                aa.push('<td class="', aT, '" ');
                                if (V) {
                                    if (V[Y]) bm.push('width:' + i.cssLength(V[Y]));
                                } else bm.push('width:' + Math.floor(100 / R.length) + '%');
                                if (W) bm.push('height:' + i.cssLength(W));
                                if (T && T.padding != undefined) bm.push('padding:' + i.cssLength(T.padding));
                                if (bm.length > 0) aa.push('style="' + bm.join('; ') + '" ');
                                aa.push('>', R[Y], '</td>');
                            }
                            aa.push('</tr></tbody>');
                            return aa.join('');
                        };
                    n.dialog.bf.call(this, P, T || {
                        type: 'hbox'
                    }, S, 'table', X, T && T.align && {
                        align: T.align
                    } || null, Z);
                },
                vbox: function(P, Q, R, S, T) {
                    if (arguments.length < 3) return;
                    this._ || (this._ = {});
                    var U = this._.children = Q,
                        V = T && T.width || null,
                        W = T && T.vY || null,
                        X = function() {
                            var Y = ['<table cellspacing="0" border="0" '];
                            Y.push('style="');
                            if (T && T.expand) Y.push('height:100%;');
                            Y.push('width:' + i.cssLength(V || '100%'), ';');
                            Y.push('"');
                            Y.push('align="', i.htmlEncode(T && T.align || (P.eY().lang.dir == 'ltr' ? 'left' : 'right')), '" ');
                            Y.push('><tbody>');
                            for (var Z = 0; Z < R.length; Z++) {
                                var aa = [];
                                Y.push('<tr><td ');
                                if (V) aa.push('width:' + i.cssLength(V || '100%'));
                                if (W) aa.push('height:' + i.cssLength(W[Z]));
                                else if (T && T.expand) aa.push('height:' + Math.floor(100 / R.length) + '%');
                                if (T && T.padding != undefined) aa.push('padding:' + i.cssLength(T.padding));
                                if (aa.length > 0) Y.push('style="', aa.join('; '), '" ');
                                Y.push(' class="cke_dialog_ui_vbox_child">', R[Z], '</td></tr>');
                            }
                            Y.push('</tbody></table>');
                            return Y.join('');
                        };
                    n.dialog.bf.call(this, P, T || {
                        type: 'vbox'
                    }, S, 'div', null, null, X);
                }
            };
        })();
        n.dialog.bf.prototype = {
            getElement: function() {
                return a.document.getById(this.oJ);
            },
            getInputElement: function() {
                return this.getElement();
            },
            getDialog: function() {
                return this._.dialog;
            },
            setValue: function(P) {
                this.getInputElement().setValue(P);
                this.oW('change', {
                    value: P
                });
                return this;
            },
            getValue: function() {
                return this.getInputElement().getValue();
            },
            isChanged: function() {
                return false;
            },
            selectParentTab: function() {
                var S = this;
                var P = S.getInputElement(),
                    Q = P,
                    R;
                while ((Q = Q.getParent()) && Q.$.className.search('cke_dialog_page_contents') == -1) {}
                if (!Q) return S;
                R = Q.getAttribute('name');
                if (S._.dialog._.gx != R) S._.dialog.selectPage(R);
                return S;
            },
            focus: function() {
                this.selectParentTab().getInputElement().focus();
                return this;
            },
            nc: function(P) {
                var Q = /^on([A-Z]\w+)/,
                    R, S = function(U, V, W, X) {
                        V.on('load', function() {
                            U.getInputElement().on(W, X, U);
                        });
                    };
                for (var T in P) {
                    if (!(R = T.match(Q))) continue;
                    if (this.dm[T]) this.dm[T].call(this, this._.dialog, P[T]);
                    else S(this, this._.dialog, R[1].toLowerCase(), P[T]);
                }
                return this;
            },
            dm: {
                onLoad: function(P, Q) {
                    P.on('load', Q, this);
                },
                onShow: function(P, Q) {
                    P.on('show', Q, this);
                },
                onHide: function(P, Q) {
                    P.on('hide', Q, this);
                }
            },
            iU: function(P, Q) {
                this.focus();
            },
            eZ: function(P, Q) {},
            disable: function() {
                var P = this.getInputElement();
                P.setAttribute('disabled', 'true');
                P.addClass('cke_disabled');
            },
            enable: function() {
                var P = this.getInputElement();
                P.removeAttribute('disabled');
                P.removeClass('cke_disabled');
            },
            isEnabled: function() {
                return !this.getInputElement().getAttribute('disabled');
            },
            isVisible: function() {
                return this.getInputElement().isVisible();
            },
            fM: function() {
                if (!this.isEnabled() || !this.isVisible()) return false;
                return true;
            }
        };
        n.dialog.hbox.prototype = i.extend(new n.dialog.bf(), {
            getChild: function(P) {
                var Q = this;
                if (arguments.length < 1) return Q._.children.concat();
                if (!P.splice) P = [P];
                if (P.length < 2) return Q._.children[P[0]];
                else return Q._.children[P[0]] && Q._.children[P[0]].getChild ? Q._.children[P[0]].getChild(P.slice(1, P.length)) : null;
            }
        }, true);
        n.dialog.vbox.prototype = new n.dialog.hbox();
        (function() {
            var P = {
                dQ: function(Q, R, S) {
                    var T = R.children,
                        U, V = [],
                        W = [];
                    for (var X = 0; X < T.length && (U = T[X]); X++) {
                        var Y = [];
                        V.push(Y);
                        W.push(a.dialog._.gv[U.type].dQ(Q, U, Y));
                    }
                    return new n.dialog[R.type](Q, W, V, S, R);
                }
            };
            a.dialog.addUIElement('hbox', P);
            a.dialog.addUIElement('vbox', P);
        })();
        a.rB = function(P) {
            this.ry = P;
        };
        a.rB.prototype = {
            exec: function(P) {
                P.openDialog(this.ry);
            },
            sG: false
        };
        (function() {
            var P = /^([a]|[^a])+$/,
                Q = /^\d*$/,
                R = /^\d*(?:\.\d+)?$/;
            a.sg = 1;
            a.jb = 2;
            a.dialog.validate = {
                functions: function() {
                    return function() {
                        var Y = this;
                        var S = Y && Y.getValue ? Y.getValue() : arguments[0],
                            T = undefined,
                            U = a.jb,
                            V = [],
                            W;
                        for (W = 0; W < arguments.length; W++) {
                            if (typeof arguments[W] == 'function') V.push(arguments[W]);
                            else break;
                        }
                        if (W < arguments.length && typeof arguments[W] == 'string') {
                            T = arguments[W];
                            W++;
                        }
                        if (W < arguments.length && typeof arguments[W] == 'number') U = arguments[W];
                        var X = U == a.jb ? true : false;
                        for (W = 0; W < V.length; W++) {
                            if (U == a.jb) X = X && V[W](S);
                            else X = X || V[W](S);
                        }
                        if (!X) {
                            if (T !== undefined) alert(T);
                            if (Y && (Y.select || Y.focus)) Y.select || Y.focus();
                            return false;
                        }
                        return true;
                    };
                },
                regex: function(S, T) {
                    return function() {
                        var V = this;
                        var U = V && V.getValue ? V.getValue() : arguments[0];
                        if (!S.test(U)) {
                            if (T !== undefined) alert(T);
                            if (V && (V.select || V.focus)) if (V.select) V.select();
                            else V.focus();
                            return false;
                        }
                        return true;
                    };
                },
                notEmpty: function(S) {
                    return this.regex(P, S);
                },
                integer: function(S) {
                    return this.regex(Q, S);
                },
                number: function(S) {
                    return this.regex(R, S);
                },
                equals: function(S, T) {
                    return this.functions(function(U) {
                        return U == S;
                    }, T);
                },
                notEqual: function(S, T) {
                    return this.functions(function(U) {
                        return U != S;
                    }, T);
                }
            };
        })();

        function O(P, Q) {
            var R = function() {
                    T(this);
                    Q(this);
                },
                S = function() {
                    T(this);
                },
                T = function(U) {
                    U.removeListener('ok', R);
                    U.removeListener('cancel', S);
                };
            P.on('ok', R);
            P.on('cancel', S);
        };
        i.extend(a.application.prototype, {
            openDialog: function(P, Q, R) {
                var S = a.dialog._.ev[P];
                if (typeof S == 'function') {
                    var T = this._.oB || (this._.oB = {}),
                        U = T[P] || (T[P] = new a.dialog(this, P));
                    Q && Q.call(U, U);
                    !this._.activeElement && (this._.activeElement = this.document.$.activeElement);
                    !this._.oO && (this._.oO = this.aG['filesview.filesview'].tools.oO());
                    U.show();
                    return U;
                } else if (S == 'failed') throw new Error('[CKFINDER.dialog.openDialog] Dialog "' + P + '" failed when loading dg.');
                var V = a.document.bH(),
                    W = V.$.style.cursor,
                    X = this;
                V.setStyle('cursor', 'wait');
                a.scriptLoader.load(a.getUrl(S), function() {
                    if (typeof a.dialog._.ev[P] != 'function') a.dialog._.ev[P] = 'failed';
                    X.openDialog(P, Q);
                    V.setStyle('cursor', W);
                }, null, null, R);
                return null;
            },
            hs: function(P, Q, R, S) {
                var T = this;
                setTimeout(function() {
                    T.cg.openDialog('Input', function(U) {
                        U.show();
                        U.setTitle(P || T.lang.common.inputTitle);
                        U.getContentElement('tab1', 'msg').getElement().setHtml(Q);
                        U.getContentElement('tab1', 'input').setValue(R);
                        O(U, function(V) {
                            var W = V.getContentElement('tab1', 'input').getValue();
                            S(W);
                        });
                    });
                }, 0);
            },
            msgDialog: function(P, Q, R) {
                var S = this;
                setTimeout(function() {
                    S.cg.openDialog('Msg', function(T) {
                        T.show();
                        T.setTitle(P || S.lang.common.messageTitle);
                        T.getContentElement('tab1', 'msg').getElement().setHtml(Q);
                        R && O(T, function(U) {
                            R();
                        });
                    });
                }, 0);
            },
            fe: function(P, Q, R) {
                var S = this;
                setTimeout(function() {
                    S.cg.openDialog('Confirm', function(T) {
                        T.show();
                        T.setTitle(P || S.lang.common.confirmationTitle);
                        T.getContentElement('tab1', 'msg').getElement().setHtml(Q);
                        O(T, function(U) {
                            R();
                        });
                    });
                }, 0);
            },
            skippedFilesDialog: function(P, Q, R, S) {
                var T = this;
                setTimeout(function() {
                    T.cg.openDialog('SkippedFiles', function(U) {
                        U.show();
                        U.setTitle(P || T.lang.common.messageTitle);
                        if (R) {
                            U.getContentElement('tab1', 'msg').getElement().show();
                            U.getContentElement('tab1', 'msg').getElement().setHtml(R);
                        } else U.getContentElement('tab1', 'msg').getElement().hide();
                        var V = '',
                            W = 'cke_files_list',
                            X = '',
                            Y = Q.length;
                        if (Y > 3) {
                            W += ' cke_files_list_many';
                            X = ' style="height: ' + Math.min(Y + 0.1, 20) + 'em"';
                        }
                        for (var Z = 0; Z < Y; Z++) V += '<li>' + (typeof Q[Z] == 'string' ? Q[Z] : Q[Z].getAttribute('name')) + '</li>';
                        U.getContentElement('tab1', 'skippedList').getElement().setHtml('<ul class="' + W + '"' + X + '>' + V + '</ul>');
                        S && O(U, function() {
                            S();
                        });
                    });
                }, 0);
            }
        });
        m.add('dialog', {
            bM: ['dialogui'],
            onLoad: function() {
                a.dialog.add('Confirm', function(P) {
                    return {
                        title: P.lang.common.confirmationTitle,
                        minWidth: 270,
                        minHeight: 60,
                        contents: [{
                            id: 'tab1',
                            elements: [{
                                type: 'html',
                                html: '',
                                id: 'msg'
                            }]
                        }],
                        buttons: [CKFinder.dialog.okButton, CKFinder.dialog.cancelButton]
                    };
                });
                a.dialog.add('Msg', function(P) {
                    return {
                        title: P.lang.common.messageTitle,
                        minWidth: 270,
                        minHeight: 60,
                        contents: [{
                            id: 'tab1',
                            elements: [{
                                type: 'html',
                                html: '',
                                id: 'msg'
                            }]
                        }],
                        buttons: [CKFinder.dialog.okButton]
                    };
                });
                a.dialog.add('Input', function(P) {
                    return {
                        title: P.lang.common.inputTitle,
                        minWidth: 270,
                        minHeight: 60,
                        contents: [{
                            id: 'tab1',
                            elements: [{
                                type: 'html',
                                html: '',
                                id: 'msg'
                            }, {
                                type: 'text',
                                id: 'input'
                            }]
                        }],
                        buttons: [CKFinder.dialog.okButton, CKFinder.dialog.cancelButton]
                    };
                });
                a.dialog.add('SkippedFiles', function(P) {
                    return {
                        title: P.lang.common.messageTitle,
                        minWidth: 400,
                        minHeight: 100,
                        contents: [{
                            id: 'tab1',
                            style: f.ie7Compat ? 'height: auto' : '',
                            expand: true,
                            padding: 0,
                            elements: [{
                                type: 'vbox',
                                expand: true,
                                children: [{
                                    type: 'html',
                                    className: 'cke_dialog_msg',
                                    html: '',
                                    id: 'msg'
                                }, {
                                    type: 'html',
                                    id: 'skippedDescription',
                                    className: 'cke_dialog_msg',
                                    html: P.lang.SkippedFiles
                                }, {
                                    type: 'html',
                                    id: 'skippedList',
                                    className: 'cke_dialog_msg',
                                    html: ''
                                }]
                            }]
                        }],
                        buttons: [CKFinder.dialog.okButton]
                    };
                });
            }
        });
    })();
    m.add('dialogui');
    (function() {
        var p = function(w) {
                var z = this;
                z._ || (z._ = {});
                z._['default'] = z._.hq = w['default'] || '';
                var x = [z._];
                for (var y = 1; y < arguments.length; y++) x.push(arguments[y]);
                x.push(true);
                i.extend.apply(i, x);
                return z._;
            },
            q = {
                dQ: function(w, x, y) {
                    return new n.dialog.ju(w, x, y);
                }
            },
            r = {
                dQ: function(w, x, y) {
                    return new n.dialog[x.type](w, x, y);
                }
            },
            s = {
                isChanged: function() {
                    return this.getValue() != this.lu();
                },
                reset: function() {
                    this.setValue(this.lu());
                },
                jW: function() {
                    this._.hq = this.getValue();
                },
                ki: function() {
                    this._.hq = this._['default'];
                },
                lu: function() {
                    return this._.hq;
                }
            },
            t = i.extend({}, n.dialog.bf.prototype.dm, {
                onChange: function(w, x) {
                    if (!this._.pL) {
                        w.on('load', function() {
                            this.getInputElement().on('change', function() {
                                this.oW('change', {
                                    value: this.getValue()
                                });
                            }, this);
                        }, this);
                        this._.pL = true;
                    }
                    this.on('change', x);
                }
            }, true),
            u = /^on([A-Z]\w+)/,
            v = function(w) {
                for (var x in w) {
                    if (u.test(x) || x == 'title' || x == 'type') delete w[x];
                }
                return w;
            };
        i.extend(n.dialog, {
            dD: function(w, x, y, z) {
                if (arguments.length < 4) return;
                var A = p.call(this, x);
                A.hz = i.getNextNumber() + '_label';
                var B = this._.children = [],
                    C = function() {
                        var D = [];
                        if (x.uC != 'horizontal') D.push('<div class="cke_dialog_ui_labeled_label" id="', A.hz, '" >', x.label, '</div>', '<div class="cke_dialog_ui_labeled_content">', z(w, x), '</div>');
                        else {
                            var E = {
                                type: 'hbox',
                                widths: x.widths,
                                padding: 0,
                                children: [{
                                    type: 'html',
                                    html: '<span class="cke_dialog_ui_labeled_label" id="' + A.hz + '">' + i.htmlEncode(x.label) + '</span>'
                                }, {
                                    type: 'html',
                                    html: '<span class="cke_dialog_ui_labeled_content">' + z(w, x) + '</span>'
                                }]
                            };
                            a.dialog._.gv.hbox.dQ(w, E, D);
                        }
                        return D.join('');
                    };
                n.dialog.bf.call(this, w, x, y, 'div', null, null, C);
            },
            ju: function(w, x, y) {
                if (arguments.length < 3) return;
                p.call(this, x);
                var z = this._.le = i.getNextNumber() + '_textInput',
                    A = {
                        'class': 'cke_dialog_ui_input_' + x.type,
                        id: z,
                        type: 'text'
                    },
                    B;
                if (x.validate) this.validate = x.validate;
                if (x.maxLength) A.uy = x.maxLength;
                if (x.size) A.size = x.size;
                var C = this,
                    D = false;
                w.on('load', function() {
                    C.getInputElement().on('keydown', function(F) {
                        if (F.data.db() == 13) D = true;
                    });
                    C.getInputElement().on('keyup', function(F) {
                        if (F.data.db() == 13 && D) {
                            w.getButton('ok') && setTimeout(function() {
                                w.getButton('ok').click();
                            }, 0);
                            D = false;
                        }
                    }, null, null, 1000);
                });
                var E = function() {
                    var F = ['<div class="cke_dialog_ui_input_', x.type, '"'];
                    if (x.width) F.push('style="width:' + x.width + '" ');
                    F.push('><input ');
                    for (var G in A) F.push(G + '="' + A[G] + '" ');
                    F.push(' /></div>');
                    return F.join('');
                };
                n.dialog.dD.call(this, w, x, y, E);
            },
            textarea: function(w, x, y) {
                if (arguments.length < 3) return;
                p.call(this, x);
                var z = this,
                    A = this._.le = i.getNextNumber() + '_textarea',
                    B = {};
                if (x.validate) this.validate = x.validate;
                B.rows = x.rows || 5;
                B.cols = x.cols || 20;
                var C = function() {
                    var D = ['<div class="cke_dialog_ui_input_textarea"><textarea class="cke_dialog_ui_input_textarea" id="', A, '" '];
                    for (var E in B) D.push(E + '="' + i.htmlEncode(B[E]) + '" ');
                    D.push('>', i.htmlEncode(z._['default']), '</textarea></div>');
                    return D.join('');
                };
                n.dialog.dD.call(this, w, x, y, C);
            },
            checkbox: function(w, x, y) {
                if (arguments.length < 3) return;
                var z = p.call(this, x, {
                    'default': !!x['default']
                });
                if (x.validate) this.validate = x.validate;
                var A = function() {
                    var B = i.extend({}, x, {
                            id: x.id ? x.id + '_checkbox' : i.getNextNumber() + '_checkbox'
                        }, true),
                        C = [],
                        D = {
                            'class': 'cke_dialog_ui_checkbox_input',
                            type: 'checkbox'
                        };
                    v(B);
                    if (x['default']) D.checked = 'checked';
                    z.checkbox = new n.dialog.bf(w, B, C, 'input', null, D);
                    C.push(' <label for="', D.id, '">', i.htmlEncode(x.label), '</label>');
                    return C.join('');
                };
                n.dialog.bf.call(this, w, x, y, 'span', null, null, A);
            },
            radio: function(w, x, y) {
                if (arguments.length < 3) return;
                p.call(this, x);
                if (!this._['default']) this._['default'] = this._.hq = x.items[0][1];
                if (x.validate) this.validate = x.sh;
                var z = [],
                    A = this,
                    B = function() {
                        var C = [],
                            D = [],
                            E = {
                                'class': 'cke_dialog_ui_radio_item'
                            },
                            F = x.id ? x.id + '_radio' : i.getNextNumber() + '_radio';
                        for (var G = 0; G < x.items.length; G++) {
                            var H = x.items[G],
                                I = H[2] !== undefined ? H[2] : H[0],
                                J = H[1] !== undefined ? H[1] : H[0],
                                K = i.extend({}, x, {
                                    id: i.getNextNumber() + '_radio_input',
                                    title: null,
                                    type: null
                                }, true),
                                L = i.extend({}, K, {
                                    id: null,
                                    title: I
                                }, true),
                                M = {
                                    type: 'radio',
                                    'class': 'cke_dialog_ui_radio_input',
                                    name: F,
                                    value: J
                                },
                                N = [];
                            if (A._['default'] == J) M.checked = 'checked';
                            v(K);
                            v(L);
                            z.push(new n.dialog.bf(w, K, N, 'input', null, M));
                            N.push(' ');
                            new n.dialog.bf(w, L, N, 'label', null, {
                                'for': M.id
                            }, H[0]);
                            C.push(N.join(''));
                        }
                        new n.dialog.hbox(w, [], C, D);
                        return D.join('');
                    };
                n.dialog.dD.call(this, w, x, y, B);
                this._.children = z;
            },
            button: function(w, x, y) {
                if (!arguments.length) return;
                if (typeof x == 'function') x = x(w.eY());
                p.call(this, x, {
                    disabled: x.disabled || false
                });
                a.event.du(this);
                var z = this;
                w.on('load', function(B) {
                    var C = this.getElement();
                    (function() {
                        C.on('click', function(D) {
                            z.oW('click', {
                                dialog: z.getDialog()
                            });
                            D.data.preventDefault();
                        });
                    })();
                    C.unselectable();
                }, this);
                var A = i.extend({}, x);
                delete A.style;
                n.dialog.bf.call(this, w, A, y, 'a', null, {
                    style: x.style,
                    href: 'javascript:void(0)',
                    title: x.label,
                    hp: 'true',
                    'class': x['class']
                }, '<span class="cke_dialog_ui_button">' + i.htmlEncode(x.label) + '</span>');
            },
            select: function(w, x, y) {
                if (arguments.length < 3) return;
                var z = p.call(this, x);
                if (x.validate) this.validate = x.validate;
                var A = function() {
                    var B = i.extend({}, x, {
                            id: x.id ? x.id + '_select' : i.getNextNumber() + '_select'
                        }, true),
                        C = [],
                        D = [],
                        E = {
                            'class': 'cke_dialog_ui_input_select'
                        };
                    if (x.size != undefined) E.size = x.size;
                    if (x.multiple != undefined) E.multiple = x.multiple;
                    v(B);
                    for (var F = 0, G; F < x.items.length && (G = x.items[F]); F++) D.push('<option value="', i.htmlEncode(G[1] !== undefined ? G[1] : G[0]), '" /> ', i.htmlEncode(G[0]));
                    z.select = new n.dialog.bf(w, B, C, 'select', null, E, D.join(''));
                    return C.join('');
                };
                n.dialog.dD.call(this, w, x, y, A);
            },
            file: function(w, x, y) {
                if (arguments.length < 3) return;
                if (x['default'] === undefined) x['default'] = '';
                var z = i.extend(p.call(this, x), {
                    dg: x,
                    buttons: []
                });
                if (x.validate) this.validate = x.validate;
                var A = function() {
                    z.gL = i.getNextNumber() + '_fileInput';
                    var B = f.isCustomDomain(),
                        C = ['<iframe frameborder="0" allowtransparency="0" class="cke_dialog_ui_input_file" id="', z.gL, '" title="', x.label, '" src="javascript:void('];
                    C.push(B ? "(function(){document.open();document.domain='" + document.domain + "';" + 'document.close();' + '})()' : '0');
                    C.push(')"></iframe>');
                    return C.join('');
                };
                w.on('load', function() {
                    var B = a.document.getById(z.gL),
                        C = B.getParent();
                    C.addClass('cke_dialog_ui_input_file');
                });
                n.dialog.dD.call(this, w, x, y, A);
            },
            fileButton: function(w, x, y) {
                if (arguments.length < 3) return;
                var z = p.call(this, x),
                    A = this;
                if (x.validate) this.validate = x.validate;
                var B = i.extend({}, x),
                    C = B.onClick;
                B.className = (B.className ? B.className + ' ' : '') + 'cke_dialog_ui_button';
                B.onClick = function(D) {
                    var E = x['for'];
                    if (!C || C.call(this, D) !== false) {
                        w.getContentElement(E[0], E[1]).submit();
                        this.disable();
                    }
                };
                w.on('load', function() {
                    w.getContentElement(x['for'][0], x['for'][1])._.buttons.push(A);
                });
                n.dialog.button.call(this, w, B, y);
            },
            html: (function() {
                var w = /^\s*<[\w:]+\s+([^>]*)?>/,
                    x = /^(\s*<[\w:]+(?:\s+[^>]*)?)((?:.|\r|\n)+)$/,
                    y = /\/$/;
                return function(z, A, B) {
                    if (arguments.length < 3) return;
                    var C = [],
                        D, E = A.html,
                        F, G;
                    if (E.charAt(0) != '<') E = '<span>' + E + '</span>';
                    if (A.focus) {
                        var H = this.focus;
                        this.focus = function() {
                            H.call(this);
                            A.focus.call(this);
                            this.oW('focus');
                        };
                        if (A.fM) {
                            var I = this.fM;
                            this.fM = I;
                        }
                        this.eA = true;
                    }
                    n.dialog.bf.call(this, z, A, C, 'span', null, null, '');
                    D = C.join('');
                    F = D.match(w);
                    G = E.match(x) || ['', '', ''];
                    if (y.test(G[1])) {
                        G[1] = G[1].slice(0, -1);
                        G[2] = '/' + G[2];
                    }
                    B.push([G[1], ' ', F[1] || '', G[2]].join(''));
                };
            })()
        }, true);
        n.dialog.html.prototype = new n.dialog.bf();
        n.dialog.dD.prototype = i.extend(new n.dialog.bf(), {
            rW: function(w) {
                var x = a.document.getById(this._.hz);
                if (x.iu() < 1) new h.text(w, a.document).appendTo(x);
                else x.getChild(0).$.nodeValue = w;
                return this;
            },
            vt: function() {
                var w = a.document.getById(this._.hz);
                if (!w || w.iu() < 1) return '';
                else return w.getChild(0).getText();
            },
            dm: t
        }, true);
        n.dialog.button.prototype = i.extend(new n.dialog.bf(), {
            click: function() {
                var w = this;
                if (!w._.disabled) return w.oW('click', {
                    dialog: w._.dialog
                });
                w.getElement().$.blur();
                return false;
            },
            enable: function() {
                this._.disabled = false;
                var w = this.getElement();
                w && w.removeClass('disabled');
            },
            disable: function() {
                this._.disabled = true;
                this.getElement().addClass('disabled');
            },
            isVisible: function() {
                return this.getElement().getFirst().isVisible();
            },
            isEnabled: function() {
                return !this._.disabled;
            },
            dm: i.extend({}, n.dialog.bf.prototype.dm, {
                onClick: function(w, x) {
                    this.on('click', x);
                }
            }, true),
            eZ: function() {
                this.click();
            },
            iU: function() {
                this.focus();
            },
            eA: true
        }, true);
        n.dialog.ju.prototype = i.extend(new n.dialog.dD(), {
            getInputElement: function() {
                return a.document.getById(this._.le);
            },
            focus: function() {
                var w = this.selectParentTab();
                setTimeout(function() {
                    var x = w.getInputElement();
                    x && x.$.focus();
                }, 0);
            },
            select: function() {
                var w = this.selectParentTab();
                setTimeout(function() {
                    var x = w.getInputElement();
                    if (x) {
                        x.$.focus();
                        x.$.select();
                    }
                }, 0);
            },
            eZ: function() {
                this.select();
            },
            setValue: function(w) {
                w = w !== null ? w : '';
                return n.dialog.bf.prototype.setValue.call(this, w);
            },
            eA: true
        }, s, true);
        n.dialog.textarea.prototype = new n.dialog.ju();
        n.dialog.select.prototype = i.extend(new n.dialog.dD(), {
            getInputElement: function() {
                return this._.select.getElement();
            },
            add: function(w, x, y) {
                var z = new k('option', this.getDialog().eY().document),
                    A = this.getInputElement().$;
                z.$.text = w;
                z.$.value = x === undefined || x === null ? w : x;
                if (y === undefined || y === null) {
                    if (g) A.add(z.$);
                    else A.add(z.$, null);
                } else A.add(z.$, y);
                return this;
            },
            remove: function(w) {
                var x = this.getInputElement().$;
                x.remove(w);
                return this;
            },
            clear: function() {
                var w = this.getInputElement().$;
                while (w.length > 0) w.remove(0);
                return this;
            },
            eA: true
        }, s, true);
        n.dialog.checkbox.prototype = i.extend(new n.dialog.bf(), {
            getInputElement: function() {
                return this._.checkbox.getElement();
            },
            setValue: function(w) {
                this.getInputElement().$.checked = w;
                this.oW('change', {
                    value: w
                });
            },
            getValue: function() {
                return this.getInputElement().$.checked;
            },
            eZ: function() {
                this.setValue(!this.getValue());
            },
            dm: {
                onChange: function(w, x) {
                    if (!g) return t.onChange.apply(this, arguments);
                    else {
                        w.on('load', function() {
                            var y = this._.checkbox.getElement();
                            y.on('propertychange', function(z) {
                                z = z.data.$;
                                if (z.propertyName == 'checked') this.oW('change', {
                                    value: y.$.checked
                                });
                            }, this);
                        }, this);
                        this.on('change', x);
                    }
                    return null;
                }
            },
            eA: true
        }, s, true);
        n.dialog.radio.prototype = i.extend(new n.dialog.bf(), {
            setValue: function(w) {
                var x = this._.children,
                    y;
                for (var z = 0; z < x.length && (y = x[z]); z++) y.getElement().$.checked = y.getValue() == w;
                this.oW('change', {
                    value: w
                });
            },
            getValue: function() {
                var w = this._.children;
                for (var x = 0; x < w.length; x++) {
                    if (w[x].getElement().$.checked) return w[x].getValue();
                }
                return null;
            },
            eZ: function() {
                var w = this._.children,
                    x;
                for (x = 0; x < w.length; x++) {
                    if (w[x].getElement().$.checked) {
                        w[x].getElement().focus();
                        return;
                    }
                }
                w[0].getElement().focus();
            },
            dm: {
                onChange: function(w, x) {
                    if (!g) return t.onChange.apply(this, arguments);
                    else {
                        w.on('load', function() {
                            var y = this._.children,
                                z = this;
                            for (var A = 0; A < y.length; A++) {
                                var B = y[A].getElement();
                                B.on('propertychange', function(C) {
                                    C = C.data.$;
                                    if (C.propertyName == 'checked' && this.$.checked) z.oW('change', {
                                        value: this.getAttribute('value')
                                    });
                                });
                            }
                        }, this);
                        this.on('change', x);
                    }
                    return null;
                }
            },
            eA: true
        }, s, true);
        n.dialog.file.prototype = i.extend(new n.dialog.dD(), s, {
            getInputElement: function() {
                var w = a.document.getById(this._.gL).getFrameDocument();
                return w.$.forms.length > 0 ? new k(w.$.forms[0].elements[0]) : this.getElement();
            },
            submit: function() {
                this.getInputElement().getParent().$.submit();
                return this;
            },
            vy: function(w) {
                return this.getInputElement().getParent().$.action;
            },
            reset: function() {
                var w = a.document.getById(this._.gL),
                    x = w.getFrameDocument(),
                    y = this._.dg,
                    z = this._.buttons;

                function A() {
                    x.$.open();
                    if (f.isCustomDomain()) x.$.domain = document.domain;
                    var B = '';
                    if (y.size) B = y.size - (g ? 7 : 0);
                    x.$.write(['<html><head><title></title></head><body style="margin: 0; overflow: hidden; background: transparent;">', '<form enctype="multipart/form-data" method="POST" action="', i.htmlEncode(y.action), '">', '<input type="file" name="', i.htmlEncode(y.id || 'cke_upload'), '" size="', i.htmlEncode(B > 0 ? B : ''), '" />', '</form>', '</body></html>'].join(''));
                    x.$.close();
                    for (var C = 0; C < z.length; C++) z[C].enable();
                };
                if (f.gecko) setTimeout(A, 500);
                else A();
            },
            getValue: function() {
                return '';
            },
            dm: t,
            eA: true
        }, true);
        n.dialog.fileButton.prototype = new n.dialog.button();
        a.dialog.addUIElement('text', q);
        a.dialog.addUIElement('password', q);
        a.dialog.addUIElement('textarea', r);
        a.dialog.addUIElement('checkbox', r);
        a.dialog.addUIElement('radio', r);
        a.dialog.addUIElement('button', r);
        a.dialog.addUIElement('select', r);
        a.dialog.addUIElement('file', r);
        a.dialog.addUIElement('fileButton', r);
        a.dialog.addUIElement('html', r);
        i.extend(CKFinder.dialog, a.dialog);
    })();
    (function() {
        m.add('help', {
            bM: ['toolbar', 'button'],
            bz: function q(p) {
                if (!p.config.disableHelpButton) {
                    p.bD('help', {
                        exec: function(r) {
                            r.aG['filesview.filesview'].bn().focus();
                            window.open(a.basePath + 'help/' + (r.lang.HelpLang || 'en') + '/index.html');
                        }
                    });
                    p.bY.add('Help', a.UI_BUTTON, {
                        label: p.lang.Help,
                        command: 'help'
                    });
                }
            }
        });
    })();
    (function() {
        var p = 0,
            q = 0,
            r = [],
            s, t;

        function u(C, D, E, F, G) {
            var H = 0,
                I = 0,
                J = [];
            for (var K = 0; K < C.length; K++) {
                if (!F || F(C[K])) {
                    J.push('<a href="', D.folder.getUrl(), encodeURIComponent(C[K].name), '" title="', C[K].name, '" rel="', E, '">a</a>');
                    if (C[K].isSameFile(D)) H = I;
                    I++;
                }
            }
            x();
            t = new k('div', G);
            t.setAttribute('id', 'ckf_gallery');
            t.setHtml(J.join(''));
            t.appendTo(G.bH());
            t.hide();
            return H;
        };

        function v(C) {
            if (C && C.inPopup) {
                var D = new j(C.document),
                    E = D.getWindow();
                if (!g && !f.opera || E.$.top.location.href.match(/ckfinder.html/) || E.$.top.name == 'CKFinderpopup') return D;
            }
            return a.oC;
        };

        function w(C) {
            return function() {
                C.$.activeElement && C.$.activeElement.blur();
                C.$.activeElement && C.$.activeElement.blur();
                if (!f.gecko) {
                    C.getWindow().focus();
                    C.bH().focus();
                }
            };
        };

        function x() {
            t && t.remove();
        };

        function y(C) {
            return function() {
                x();
                C && C.focus(true, true);
            };
        };

        function z(C) {
            if (C.click) C.click();
            else if (a.document.$.createEvent) {
                var D = a.document.$.createEvent('MouseEvents');
                D.initEvent('click', true, true);
                C.dispatchEvent(D);
            }
        };

        function A(C, D, E) {
            if (g && f.version < 9) C.$.onreadystatechange = function() {
                if (this.readyState == 'loaded' || this.readyState == 'complete') setTimeout(function() {
                    D.callee.apply(E, D);
                }, 0);
            };
            else C.on('load', function() {
                setTimeout(function() {
                    D.callee.apply(E, D);
                }, 0);
            });
        };
        CKFinder.addPlugin('gallery', {
            bM: ['filesview'],
            galleryCallback: function(C, D, E) {
                if (!q) B(null, C);
                var F = v(C),
                    G = F.getWindow().$,
                    H = function(T) {
                        return T.isImage();
                    };
                if (!p && C.config.gallery_autoLoad) {
                    if (!H(D)) return false;
                    var I = F.getHead(),
                        J = CKFinder.getPluginPath('gallery') + 'colorbox/',
                        K = arguments,
                        L, M = typeof G.jQuery == 'undefined';
                    if (!M) {
                        var N = G.jQuery.fn.jquery.split('.'),
                            O = parseInt(N[0], 10),
                            P = parseInt(N[1], 10),
                            Q = parseInt(N[2] || 0, 10);
                        if (O < 1 || O == 1 && P < 4 || O == 1 && P == 4 && Q < 3) M = true;
                    }
                    if (M) {
                        if (G.jQuery) r = [G.jQuery, G.$];
                        L = new k('script', F);
                        L.setAttribute('type', 'text/javascript');
                        L.setAttribute('src', J + 'jquery.min.js');
                        A(L, K, G);
                        L.appendTo(I);
                        return true;
                    }
                    F.appendStyleSheet(J + 'colorbox.css');
                    L = new k('script', F);
                    L.setAttribute('type', 'text/javascript');
                    L.setAttribute('src', J + 'jquery.colorbox-min.js');
                    A(L, K, G);
                    L.appendTo(I);
                    return true;
                }
                if (r.length) {
                    s = G.jQuery.noConflict(true);
                    G.jQuery = r[0];
                    G.$ = r[1];
                    r = [];
                }
                if (!s) s = G.jQuery;
                if (p) {
                    var R = i.getNextNumber(),
                        S;
                    switch (p) {
                        case 1:
                            if (!H(D)) return false;
                            S = u(E, D, 'ckf_gallery_' + R, H, F);
                            s('#ckf_gallery a').colorbox(i.extend({
                                minWidth: '300',
                                minHeight: '200',
                                maxWidth: '95%',
                                maxHeight: '95%',
                                scalePhotos: true,
                                current: C.lang.Gallery.current
                            }, C.config.gallery_config, {
                                group: 'ckf_gallery_' + R,
                                onClosed: y(D),
                                onOpen: w(F)
                            }, true)).eq(S).click();
                            break;
                        case 2:
                            H = function(T) {
                                return T.isImage() || T.ext == 'swf';
                            };
                            if (!H(D)) return false;
                            S = u(E, D, 'ckf_gallery_' + R, H, F);
                            G.jQuery('#ckf_gallery a').fancybox(i.extend({}, C.config.gallery_config, {
                                onClosed: x,
                                onComplete: w(F),
                                afterClose: y(D),
                                afterShow: w(F)
                            }, true)).eq(S).click();
                            break;
                        case 3:
                            H = function(T) {
                                return T.isImage() || T.ext == 'swf' || T.ext == 'mov';
                            };
                            if (!H(D)) return false;
                            S = u(E, D, 'prettyPhoto[ckf_gallery_' + R + ']', H, F);
                            G.jQuery('#ckf_gallery a').prettyPhoto(i.extend({}, C.config.gallery_config, {
                                callback: y(D),
                                changepicturecallback: w(F)
                            }, true)).eq(S).click();
                            break;
                        case 4:
                            H = function(T) {
                                return T.isImage() || T.ext == 'swf' || T.ext == 'mov';
                            };
                            if (!H(D)) return false;
                            S = u(E, D, 'ckf_gallery_' + R, H, F);
                            G.Shadowbox.qi('#ckf_gallery a', i.extend({}, C.config.gallery_config, {
                                gallery: 'ckf_gallery_' + R,
                                onClose: y(D),
                                onFinish: w(F)
                            }, true));
                            z(t.eG('a').getItem(S).$);
                            break;
                        case 5:
                            if (!H(D)) return false;
                            S = u(E, D, 'lightbox[ckf_gallery_' + R + ']', H, F);
                            z(t.eG('a').getItem(S).$);
                            break;
                        default:
                            return false;
                    }
                    return true;
                }
                return false;
            },
            bz: B
        });

        function B(C, D) {
            if (C && C.inPopup) return;
            C && C.aG['filesview.filesview'].on('afterRenderFiles', x);
            var E = v(D).getWindow().$;
            if (typeof E.jQuery != 'undefined' && E.jQuery.fn.colorbox) p = 1;
            else if (typeof E.jQuery != 'undefined' && E.jQuery.fn.fancybox) p = 2;
            else if (typeof E.jQuery != 'undefined' && E.jQuery.fn.prettyPhoto) p = 3;
            else if (typeof E.Shadowbox != 'undefined') p = 4;
            else if (typeof E.Prototype != 'undefined' && typeof E.Lightbox != 'undefined') p = 5;
            p && (q = 1);
        };
    })();
    l.gallery_autoLoad = true;
    (function() {
        function p(v) {
            if (!v || v.type != a.cv || v.getName() != 'form') return [];
            var w = [],
                x = ['style', 'className'];
            for (var y = 0; y < x.length; y++) {
                var z = x[y],
                    A = v.$.elements.namedItem(z);
                if (A) {
                    var B = new k(A);
                    w.push([B, B.nextSibling]);
                    B.remove();
                }
            }
            return w;
        };

        function q(v, w) {
            if (!v || v.type != a.cv || v.getName() != 'form') return;
            if (w.length > 0) for (var x = w.length - 1; x >= 0; x--) {
                var y = w[x][0],
                    z = w[x][1];
                if (z) y.insertBefore(z);
                else y.appendTo(v);
            }
        };

        function r(v, w) {
            var x = p(v),
                y = {},
                z = v.$;
            if (!w) {
                y['class'] = z.className || '';
                z.className = '';
            }
            y.inline = z.style.cssText || '';
            if (!w) z.style.cssText = 'position: static; overflow: visible';
            q(x);
            return y;
        };

        function s(v, w) {
            var x = p(v),
                y = v.$;
            if ('class' in w) y.className = w['class'];
            if ('inline' in w) y.style.cssText = w.inline;
            q(x);
        };
        var t = null,
            u = null;
        m.add('maximize', {
            bz: function(v) {
                var w = v.lang.Maximize,
                    x = a.oC,
                    y = x.getWindow(),
                    z = a.document.getWindow().$.frameElement && new k(a.document.getWindow().$.frameElement),
                    A = [0, 0, 0, 0],
                    B = {},
                    C, D;
                if (z && !z.getFrameDocument().bH().hasClass('CKFinderFrameWindow')) z = null;

                function E(F) {
                    var G = y.eR();
                    if (!F && z) F = [z];
                    if (F) {
                        for (var H = 0, I = F.length; H < I; H++) F[H].setStyles({
                            width: G.width + 'px',
                            height: G.height + 'px'
                        });
                        v.oW('resize');
                    } else v.resize(G.width, G.height);
                };
                v.bD('maximize', {
                    oD: false,
                    exec: function() {
                        var F = v.document.getWindow().$;
                        if (v.cg.inPopup && (!g && !f.opera || F.top.location.href.match(/ckfinder.html/) || F.top.name == 'CKFinderpopup')) {
                            var F = v.document.getWindow().$.parent;
                            if (this.bu == a.aS) {
                                A[2] = F.screenLeft || F.screenX;
                                A[3] = F.screenTop || F.screenY;
                                F.moveTo(0, 0);
                                if (!u) u = [F.screenLeft || F.screenX, F.screenTop || F.screenY];
                                A[2] -= u[0];
                                A[3] -= u[1];
                                if (!F.outerHeight) {
                                    A[0] = F.document.body.scrollWidth;
                                    A[1] = F.document.body.scrollHeight;
                                    if (!t) {
                                        F.resizeTo(F.screen.availWidth, F.screen.availHeight);
                                        t = [F.screen.availWidth - F.document.body.scrollWidth, F.screen.availHeight - F.document.body.scrollHeight];
                                    }
                                    A[0] += t[0];
                                    A[1] += t[1];
                                } else {
                                    A[0] = F.outerWidth;
                                    A[1] = F.outerHeight;
                                }
                                if (F.resizeTo) F.resizeTo(F.screen.availWidth, F.screen.availHeight);
                                else {
                                    F.outerHeight = F.screen.availHeight;
                                    F.outerWidth = F.screen.availWidth;
                                }
                            } else {
                                if (F.resizeTo) F.resizeTo(A[0], A[1]);
                                else {
                                    F.outerWidth = A[0];
                                    F.outerHeight = A[1];
                                }
                                F.moveTo(A[2], A[3]);
                            }
                        } else {
                            var G = z || v.container;
                            if (this.bu == a.aS) {
                                C = y.hV();
                                var H = G,
                                    I;
                                while (H = H.getParent()) {
                                    I = i.getNextNumber();
                                    B[I] = r(H);
                                    H.$.og = I;
                                    H.is('html', 'body') && H.setStyle('overflow', 'hidden');
                                    H.setStyle('z-index', v.config.baseFloatZIndex - 1);
                                }
                                I = i.getNextNumber();
                                B[I] = r(G, true);
                                G.$.og = I;
                                var J = [G],
                                    F = G.getDocument().getWindow().$;
                                while (F.frameElement) {
                                    J.push(k.eB(F.frameElement));
                                    F = F.parent;
                                }
                                D = function() {
                                    E(J);
                                };
                                y.on('resize', D);
                                var K = new j(F.document),
                                    L = {
                                        overflow: f.webkit ? '' : 'hidden',
                                        width: 0,
                                        height: 0
                                    };
                                K.gT().setStyles(L);
                                !f.gecko && K.gT().setStyle('position', 'fixed');
                                K.bH().setStyles(L);
                                g ? setTimeout(function() {
                                    y.$.scrollTo(0, 0);
                                }, 0) : y.$.scrollTo(0, 0);
                                var M;
                                for (var N = 0, O = J.length; N < O; N++) {
                                    M = J[N];
                                    M.setStyle('position', 'absolute');
                                    M.$.offsetLeft;
                                    M.setStyles({
                                        'z-index': v.config.baseFloatZIndex - 1,
                                        left: '0px',
                                        top: '0px'
                                    });
                                }
                                J[0].addClass('cke_maximized');
                                E(J);
                                var P = J[0].ir();
                                J[0].setStyles({
                                    left: -1 * P.x + 'px',
                                    top: -1 * P.y + 'px'
                                });
                            } else {
                                y.removeListener('resize', D);
                                var H = G;
                                while (H) {
                                    s(H, B[H.$.og]);
                                    H.$.og = null;
                                    H = H.getParent();
                                }
                                B = {};
                                g ? setTimeout(function() {
                                    y.$.scrollTo(C.x, C.y);
                                }, 0) : y.$.scrollTo(C.x, C.y);
                                G.removeClass('cke_maximized');
                                if (f.webkit) {
                                    G.setStyle('display', 'inline');
                                    setTimeout(function() {
                                        G.setStyle('display', 'block');
                                    }, 0);
                                }
                                v.oW('resize');
                            }
                        }
                        this.rJ();
                        var Q = this.pW[0];
                        if (Q) {
                            var R = this.bu == a.aS ? w.maximize : w.minimize,
                                S = v.document.getById(Q._.id);
                            S.getChild(1).setHtml(R);
                            S.setAttribute('title', R);
                            S.setAttribute('href', 'javascript:void("' + R + '");');
                        }
                    }
                });
                v.bY.qW('Maximize', {
                    label: w.maximize,
                    command: 'maximize'
                });
            }
        });
    })();
    (function() {
        var p = {};
        CKFinder.addPlugin('zip', {
            uiReady: function(r) {
                var s = r.lang.Zip;
                CKFinder.dialog.add('compressToFileName', function(t) {
                    var u = t.getSelectedFolder();
                    return {
                        title: t.lang.DestinationFile,
                        minWidth: 270,
                        minHeight: 60,
                        contents: [{
                            id: 'tab1',
                            label: '',
                            title: '',
                            expand: true,
                            style: CKFinder.env.ie7Compat ? 'height:auto' : '',
                            padding: 0,
                            elements: [{
                                id: 'msg',
                                className: 'cke_dialog_error_msg',
                                type: 'html',
                                html: t.lang.FileRename
                            }, {
                                type: 'hbox',
                                widths: ['90%', '10%'],
                                padding: 0,
                                children: [{
                                    type: 'text',
                                    label: '',
                                    id: 'fileName',
                                    'default': u.name,
                                    validate: function() {
                                        if (!this.getValue()) {
                                            t.openMsgDialog('', t.lang.ErrorMsg.pg);
                                            return false;
                                        }
                                    }
                                }, {
                                    type: 'html',
                                    html: '.zip',
                                    id: 'fileNameExt',
                                    onLoad: function() {
                                        this.getElement().getParent().setStyles({
                                            'vertical-align': 'bottom',
                                            'padding-bottom': '2px'
                                        });
                                    }
                                }]
                            }]
                        }],
                        buttons: [CKFinder.dialog.okButton, CKFinder.dialog.cancelButton]
                    };
                });
                CKFinder.dialog.add('unzipDirExists', function(t) {
                    var u = t.getSelectedFolder(),
                        v = [
                            [t.lang.ManuallyRename, 'manuallyrename']
                        ];
                    if (u.acl.fileDelete && u.acl.fileRename && u.acl.folderRename && u.acl.folderDelete) v.push([s.removeAndExtract, 'overwrite'], [s.extractAndOverwrite, 'merge']);
                    return {
                        title: t.lang.ErrorMsg.FolderNameExists,
                        minWidth: 270,
                        minHeight: 60,
                        contents: [{
                            id: 'tab1',
                            label: '',
                            title: '',
                            expand: true,
                            style: CKFinder.env.ie7Compat ? 'height:auto' : '',
                            padding: 0,
                            elements: [{
                                id: 'msg',
                                className: 'cke_dialog_error_msg',
                                type: 'html',
                                html: ''
                            }, {
                                type: 'hbox',
                                className: 'cke_dialog_file_exist_options',
                                children: [{
                                    label: t.lang.common.makeDecision,
                                    type: 'radio',
                                    id: 'option',
                                    'default': 'manuallyrename',
                                    items: v
                                }]
                            }]
                        }],
                        onOk: function() {
                            var w = this,
                                x = w.getValueOf('tab1', 'option');
                            if (x == 'manuallyrename') x = null;
                            p.extractTo(t.getSelectedFile(), x);
                            return true;
                        },
                        onCancel: function() {
                            p.ma(u);
                            return true;
                        },
                        buttons: [CKFinder.dialog.okButton, CKFinder.dialog.cancelButton]
                    };
                });
                CKFinder.dialog.add('unzipFileExists', function(t) {
                    var u = t.getSelectedFolder();
                    return {
                        title: t.lang.FileExistsDlgTitle,
                        minWidth: 350,
                        minHeight: 120,
                        contents: [{
                            id: 'tab1',
                            label: '',
                            title: '',
                            style: CKFinder.env.ie7Compat ? 'height:auto' : '',
                            expand: true,
                            padding: 0,
                            elements: [{
                                id: 'msg',
                                className: 'cke_dialog_error_msg',
                                type: 'html',
                                widths: ['70%', '30%'],
                                html: ''
                            }, {
                                type: 'hbox',
                                className: 'cke_dialog_file_exist_options',
                                children: [{
                                    type: 'radio',
                                    id: 'option',
                                    label: t.lang.common.makeDecision,
                                    'default': 'autorename',
                                    items: [
                                        [t.lang.FileAutorename, 'autorename'],
                                        [t.lang.FileOverwrite, 'overwrite'],
                                        [t.lang.common.skip, 'skip']
                                    ]
                                }]
                            }, {
                                type: 'hbox',
                                className: 'cke_dialog_remember_decision',
                                children: [{
                                    type: 'checkbox',
                                    id: 'remember',
                                    label: t.lang.common.rememberDecision
                                }]
                            }]
                        }],
                        onCancel: function() {
                            p.ma(u);
                            return true;
                        },
                        buttons: [CKFinder.dialog.okButton, CKFinder.dialog.cancelButton]
                    };
                });
                CKFinder.dialog.add('compressFileExists', function(t) {
                    var u = t.getSelectedFolder(),
                        v = [
                            [t.lang.ManuallyRename, 'manuallyrename']
                        ];
                    if (u.acl.fileDelete && u.acl.fileRename) v.push([t.lang.FileAutorename, 'autorename'], [t.lang.FileOverwrite, 'overwrite']);
                    return {
                        title: t.lang.FileExistsDlgTitle,
                        minWidth: 270,
                        minHeight: 60,
                        contents: [{
                            id: 'tab1',
                            label: '',
                            title: '',
                            expand: true,
                            style: CKFinder.env.ie7Compat ? 'height:auto' : '',
                            padding: 0,
                            elements: [{
                                id: 'msg',
                                className: 'cke_dialog_error_msg',
                                type: 'html',
                                html: ''
                            }, {
                                type: 'hbox',
                                className: 'cke_dialog_file_exist_options',
                                children: [{
                                    label: t.lang.common.makeDecision,
                                    type: 'radio',
                                    id: 'option',
                                    'default': 'manuallyrename',
                                    items: v
                                }]
                            }]
                        }],
                        onOk: function() {
                            var w = this,
                                x = w.getValueOf('tab1', 'option');
                            if (x == 'manuallyrename') x = null;
                            p.nX(t.getSelectedFolder(), p.pp.download, x);
                            return true;
                        },
                        onCancel: function() {
                            p.ma(u);
                            return true;
                        },
                        buttons: [CKFinder.dialog.okButton, CKFinder.dialog.cancelButton]
                    };
                });
                r.connector.app.dZ('zip', 112);
                p = {
                    rQ: {
                        iz: /[\\\/:\*\?"<>\|]/
                    },
                    iG: {
                        extractHere: {
                            label: s.extractHereLabel,
                            command: 'ExtractHere',
                            group: 'zip',
                            icon: CKFinder.getPluginPath('zip') + 'images/zip.gif'
                        },
                        extractTo: {
                            label: s.extractToLabel,
                            command: 'ExtractTo',
                            group: 'zip',
                            icon: CKFinder.getPluginPath('zip') + 'images/zip.gif'
                        },
                        downloadZip: {
                            label: s.downloadZipLabel,
                            command: 'DownloadZip',
                            group: 'zip',
                            icon: CKFinder.getPluginPath('zip') + 'images/zip.gif'
                        },
                        compressZip: {
                            label: s.compressZipLabel,
                            command: 'CompressZip',
                            group: 'zip',
                            icon: CKFinder.getPluginPath('zip') + 'images/zip.gif'
                        }
                    },
                    ma: function(t) {
                        t.getChildren(function(u) {
                            t.close();
                            t.showFiles();
                            t.open();
                        }, true);
                    },
                    oc: function(t) {
                        if (!t || !t.length) return r.lang.ErrorMsg.FolderEmpty;
                        if (p.rQ.iz.test(t)) return r.lang.ErrorMsg.FolderInvChar;
                        return false;
                    },
                    nI: function(t) {
                        if (!p.filesList[p.currentItem]) {
                            p.extractHere(r.getSelectedFile(), true);
                            return;
                        }
                        var u = [{
                            name: 'skip'
                        }, {
                            name: 'ok'
                        }];
                        if (p.filesList[p.currentItem].options && q(p.filesList[p.currentItem].options, u)) {
                            p.currentItem++;
                            r.openDialog('unzipFileExists', p.nI);
                            return;
                        }
                        t.show();
                        var v = r.lang.ErrorMsg[p.filesList[p.currentItem].type == 'Folder' ? 'FolderExists' : 'FileExists'];
                        v = '<strong>' + v.replace('%s', p.filesList[p.currentItem].name) + '</strong>';
                        t.getContentElement('tab1', 'msg').getElement().setHtml(v);
                        t.on('ok', function(w) {
                            w.removeListener();
                            var x = t.getValueOf('tab1', 'remember'),
                                y = t.getValueOf('tab1', 'option');
                            if (x) {
                                for (var z = 0, A = p.filesList.length; z < A; z++) {
                                    if (!p.filesList[z].options) p.filesList[z].options = y;
                                }
                                p.extractHere(r.getSelectedFile(), true);
                                return;
                            } else {
                                p.filesList[p.currentItem].options = y;
                                p.currentItem++;
                                while (p.currentItem < p.filesList.length) {
                                    if (!p.filesList[p.currentItem].options || p.filesList[p.currentItem].options && p.filesList[p.currentItem].options != 'skip') break;
                                    p.currentItem++;
                                }
                                if (p.currentItem < p.filesList.length) {
                                    setTimeout(function() {
                                        r.openDialog('unzipFileExists', p.nI);
                                    }, 0);
                                    return;
                                } else {
                                    p.extractHere(r.getSelectedFile(), true);
                                    return;
                                }
                            }
                        });
                    },
                    extract: function(t) {
                        var u = {},
                            v = t.file;
                        if (t.extra) u = t.extra;
                        u.fileName = t.file.name;
                        r.connector.sendCommandPost(t.action, null, u, function(w) {
                            p.filesList = [];
                            if (w.getErrorNumber() == 303) {
                                p.currentItem = 0;
                                var x = w.selectNodes('Connector/Errors/Error'),
                                    y = w.selectNodes('Connector/UnzippedFiles/File'),
                                    z = 0,
                                    A;
                                for (var B = 0, C = x.length; B < C; B++) {
                                    A = 'skip';
                                    if (x[B].getAttribute('code') == 115) {
                                        z = 1;
                                        A = null;
                                    }
                                    p.filesList[B] = {
                                        name: x[B].getAttribute('name'),
                                        options: A,
                                        type: x[B].getAttribute('type'),
                                        code: x[B].getAttribute('code')
                                    };
                                }
                                for (var D = 0, C = y.length; D < C; D++, B++) p.filesList[B] = {
                                    name: y[D].getAttribute('name'),
                                    options: y[D].getAttribute('action'),
                                    type: 'File',
                                    code: 0
                                };
                                if (z) {
                                    r.openDialog('unzipFileExists', p.nI);
                                    return;
                                }
                            } else if (w.checkError()) return;
                            var E = w.selectNodes('Connector/FolderExists/Folder');
                            if (E && E.length) {
                                r.openDialog('unzipDirExists', function(H) {
                                    H.show();
                                    var I = r.lang.FolderNameExists;
                                    I = '<strong>' + I.replace('%s', E[0].getAttribute('name')) + '</strong>';
                                    H.getContentElement('tab1', 'msg').getElement().setHtml(I);
                                });
                                return;
                            }
                            var y = w.selectNodes('Connector/UnzippedFiles/File');
                            if (y && y.length) {
                                var F = [];
                                for (var B = 0, G = y.length; B < G; B++) {
                                    if (y[B].getAttribute('action') == 'skip') F.push(y[B].getAttribute('name'));
                                }
                                if (p.filesList) for (var B = 0, G = p.filesList.length; B < G; B++) F.push(p.filesList[B].name);
                                if (F.length) {
                                    r.openSkippedFilesDialog(null, F, s.extractSuccess);
                                    p.ma(r.getSelectedFolder());
                                    return true;
                                }
                            }
                            r.openMsgDialog('OK', s.extractSuccess);
                            p.ma(r.getSelectedFolder());
                            return true;
                        }, v.folder.type, v.folder);
                    },
                    extractHere: function(t, u) {
                        if (u) {
                            var v = false;
                            for (var w = 0, x = p.filesList.length; w < x; w++) {
                                if (p.filesList[w].code == 115 && p.filesList[w].options != 'skip') {
                                    v = true;
                                    u = {};
                                    for (var w = 0, x = p.filesList.length; w < x; w++) {
                                        u['files[' + w + '][name]'] = p.filesList[w].name;
                                        u['files[' + w + '][options]'] = p.filesList[w].options;
                                    }
                                    break;
                                }
                            }
                            if (!v) {
                                var y = [];
                                for (var w = 0, x = p.filesList.length; w < x; w++) y.push(p.filesList[w].name);
                                r.openSkippedFilesDialog(null, y, s.extractSuccess, function() {
                                    p.ma(r.getSelectedFolder());
                                    return true;
                                });
                                return;
                            }
                        }
                        u = u || {};
                        p.extract({
                            action: 'ExtractHere',
                            file: t,
                            extra: u
                        });
                    },
                    extractTo: function(t, u) {
                        if (u) {
                            p.extract({
                                action: 'ExtractTo',
                                file: t,
                                extra: {
                                    extractDir: p.extractDir || '/',
                                    force: u
                                }
                            });
                            return;
                        }
                        r.openInputDialog(r.lang.DestinationFolder, r.lang.FolderRename, '', function(v) {
                            var w = r.getSelectedFolder(),
                                v = CKFinder.tools.trim(v),
                                x = p.oc(v);
                            if (x) {
                                r.openConfirmDialog('', x, function(y) {
                                    p.extractTo(t, u);
                                });
                                return false;
                            }
                            p.extractDir = v;
                            if (!w.hasChildren) {
                                w.createNewFolder(v);
                                p.extract({
                                    action: 'ExtractTo',
                                    file: t,
                                    extra: {
                                        extractDir: v
                                    }
                                });
                            } else w.getChildren(function(y) {
                                if (!q(v, y)) p.extract({
                                    action: 'ExtractTo',
                                    file: t,
                                    extra: {
                                        extractDir: v
                                    }
                                });
                                else {
                                    r.openDialog('unzipDirExists', function(z) {
                                        z.show();
                                        var A = r.lang.ErrorMsg.FolderExists;
                                        A = '<strong>' + A.replace('%s', v) + '</strong>';
                                        z.getContentElement('tab1', 'msg').getElement().setHtml(A);
                                    });
                                    return;
                                }
                            }, true);
                        });
                    },
                    downloadZip: function(t, u, v) {
                        var w = r.connector.composeUrl('DownloadZip', {
                            FileName: t,
                            ZipName: u
                        }, v.type, v);
                        r.connector.app.aG['filesview.filesview'].tools.downloadFile(new CKFinder.dom.document(r.document), w);
                    },
                    oH: function(t, u) {
                        r.connector.sendCommandPost('CreateZip', null, u, function(v) {
                            if (v.checkError()) return;
                            if (u.download) {
                                var w = v.selectSingleNode('Connector/ZipFile');
                                if (w) {
                                    var w = w.getAttribute('name');
                                    return p.downloadZip(w, u.zipName, t);
                                }
                            }
                            p.ma(t);
                        }, t.type, t);
                    },
                    nX: function(t, u, v, w) {
                        var x = {
                            zipName: t.name + '.zip',
                            download: u
                        };
                        if (w) for (var y = 0, z = w.length; y < z; y++) {
                            x['files[' + y + '][name]'] = w[y].name;
                            x['files[' + y + '][type]'] = w[y].folder.type;
                            x['files[' + y + '][folder]'] = w[y].folder.getPath();
                        }
                        if (v) {
                            x = p.pp;
                            x.fileExistsAction = v;
                            return p.oH(t, x);
                        }
                        if (t.isBasket || u) {
                            if (t.isBasket && typeof w === 'undefined') {
                                x.zipName = 'basket.zip';
                                for (var y = 0, z = r.basketFiles.length; y < z; y++) {
                                    x['files[' + y + '][name]'] = r.basketFiles[y].name;
                                    x['files[' + y + '][type]'] = r.basketFiles[y].folder.type;
                                    x['files[' + y + '][folder]'] = r.basketFiles[y].folder.getPath();
                                }
                            }
                            if (t.isBasket) {
                                t = r.folders[1];
                                x.basket = true;
                            }
                            return p.oH(t, x);
                        } else r.openDialog('compressToFileName', function(A) {
                            A.show();
                            A.getContentElement('tab1', 'fileName').getElement().setValue(t.name);
                            A.on('ok', function(B) {
                                B.removeListener();
                                var C = A.getValueOf('tab1', 'fileName');
                                C = CKFinder.tools.trim(C) + '.zip';
                                var D = p.oc(C);
                                if (D) {
                                    r.openConfirmDialog('', D, function(E) {
                                        p.nX(t, u);
                                    });
                                    return false;
                                } else {
                                    x.zipName = C;
                                    t.getFiles(function(E) {
                                        if (q(C, E)) {
                                            p.pp = x;
                                            r.openDialog('compressFileExists', function(F) {
                                                F.show();
                                                var G = r.lang.ErrorMsg.FileExists;
                                                G = '<strong>' + G.replace('%s', C) + '</strong>';
                                                F.getContentElement('tab1', 'msg').getElement().setHtml(G);
                                            });
                                            return false;
                                        } else p.oH(t, x);
                                    }, true);
                                }
                            });
                        });
                    }
                };
                r.addFileContextMenuOption(p.iG.extractHere, function(t, u) {
                    p.extractHere(u);
                }, function(t) {
                    var u = r.getSelectedFolder();
                    if (u.isBasket) return false;
                    var v = r.getSelectedFiles();
                    if (t.ext.toLowerCase() !== 'zip' || r.config.selectMultiple && v.length > 1) return false;
                    return t.folder.acl.fileUpload && t.folder.acl.folderCreate ? true : -1;
                });
                r.addFileContextMenuOption(p.iG.extractTo, function(t, u) {
                    p.extractTo(u);
                }, function(t) {
                    var u = r.getSelectedFolder();
                    if (u.isBasket) return false;
                    var v = r.getSelectedFiles();
                    if (t.ext.toLowerCase() !== 'zip' || r.config.selectMultiple && v.length > 1) return false;
                    return t.folder.acl.fileUpload && t.folder.acl.folderCreate ? true : -1;
                });
                r.addFileContextMenuOption(p.iG.compressZip, function(t, u) {
                    var v = t.getSelectedFiles(),
                        w = t.getSelectedFolder();
                    p.nX(w, false, false, v);
                }, function(t) {
                    var u = r.getSelectedFolder();
                    if (u.isBasket) return false;
                    var v = r.getSelectedFiles();
                    if (!r.config.selectMultiple || v.length < 2) return false;
                    return t.folder.acl.fileUpload && t.folder.acl.folderCreate && u.getResourceType().isExtensionAllowed('zip') ? true : -1;
                });
                r.addFileContextMenuOption(p.iG.downloadZip, function(t, u) {
                    var v = t.getSelectedFiles(),
                        w = t.getSelectedFolder();
                    p.nX(w, true, false, v);
                }, function(t) {
                    var u = r.getSelectedFiles();
                    if (!r.config.selectMultiple || u.length < 2) return false;
                    return t.folder.acl.fileUpload ? true : -1;
                });
                r.addFolderContextMenuOption(p.iG.compressZip, function(t, u) {
                    p.nX(u, false);
                }, function(t) {
                    if (t.isBasket) return false;
                    return t.acl.fileUpload && t.getResourceType().isExtensionAllowed('zip') && (r.files.length || t.hasChildren) ? true : -1;
                });
                r.addFolderContextMenuOption(p.iG.downloadZip, function(t, u) {
                    p.nX(u, true);
                }, function(t) {
                    if (t.isBasket) return t.app.basketFiles.length ? true : -1;
                    return t.acl.fileUpload && (r.files.length || t.hasChildren) ? true : -1;
                });
                r.connector.app.aG['filesview.filesview'].on('beforeContextMenu', function(t) {
                    if (r.getSelectedFiles().length > 1) delete t.data.bj.downloadFile;
                });
            },
            basketToolbar: [
                ['DownloadZip',
                    {
                        label: 'downloadZipLabel',
                        icon: CKFinder.getPluginPath('zip') + 'images/zip.gif',
                        onClick: function(r) {
                            var s = r.getSelectedFolder();
                            s.app.basketFiles.length && p.nX(s, true);
                        },
                        disableEmpty: true
                    }]
            ]
        });

        function q(r, s) {
            for (var t = 0, u = s.length; t < u; t++) {
                if (s[t].name && s[t].name === r) return true;
            }
            return false;
        };
    })();
    a.skins.add('kama', (function() {
        var p = ['images/loaders/16x16.gif', 'images/loaders/32x32.gif', 'images/ckffolder.gif', 'images/ckffolderopened.gif'];
        if (g && f.version < 7) p.push('images/sprites_ie6.png');
        return {
            ls: p,
            application: {
                css: ['app.css']
            },
            host: {
                qx: 1,
                css: ['host.css']
            },
            mA: 7,
            kN: 7,
            ps: 1,
            bz: function(q) {
                if (q.config.width && !isNaN(q.config.width)) q.config.width -= 12;
                var r = [],
                    s = '/* UI Color Support */.cke_skin_kama .cke_menuitem .cke_icon_wrapper{\tbackground-color: $color !important;\tborder-color: $color !important;}.cke_skin_kama .cke_menuitem a:hover .cke_icon_wrapper,.cke_skin_kama .cke_menuitem a:focus .cke_icon_wrapper,.cke_skin_kama .cke_menuitem a:active .cke_icon_wrapper{\tbackground-color: $color !important;\tborder-color: $color !important;}.cke_skin_kama .cke_menuitem a:hover .cke_label,.cke_skin_kama .cke_menuitem a:focus .cke_label,.cke_skin_kama .cke_menuitem a:active .cke_label{\tbackground-color: $color !important;}.cke_skin_kama .cke_menuitem a.cke_disabled:hover .cke_label,.cke_skin_kama .cke_menuitem a.cke_disabled:focus .cke_label,.cke_skin_kama .cke_menuitem a.cke_disabled:active .cke_label{\tbackground-color: transparent !important;}.cke_skin_kama .cke_menuitem a.cke_disabled:hover .cke_icon_wrapper,.cke_skin_kama .cke_menuitem a.cke_disabled:focus .cke_icon_wrapper,.cke_skin_kama .cke_menuitem a.cke_disabled:active .cke_icon_wrapper{\tbackground-color: $color !important;\tborder-color: $color !important;}.cke_skin_kama .cke_menuitem a.cke_disabled .cke_icon_wrapper{\tbackground-color: $color !important;\tborder-color: $color !important;}.cke_skin_kama .cke_menuseparator{\tbackground-color: $color !important;}.cke_skin_kama .cke_menuitem a:hover,.cke_skin_kama .cke_menuitem a:focus,.cke_skin_kama .cke_menuitem a:active{\tbackground-color: $color !important;}';
                if (f.webkit) {
                    s = s.split('}').slice(0, -1);
                    for (var t = 0; t < s.length; t++) s[t] = s[t].split('{');
                }
                function u(x) {
                    var y = x.getHead().append('style');
                    y.setAttribute('id', 'cke_ui_color');
                    y.setAttribute('type', 'text/css');
                    return y;
                };

                function v(x, y, z) {
                    var A, B, C;
                    for (var D = 0; D < x.length; D++) {
                        if (f.webkit) {
                            for (B = 0; B < x[D].$.sheet.rules.length; B++) x[D].$.sheet.removeRule(B);
                            for (B = 0; B < y.length; B++) {
                                C = y[B][1];
                                for (A = 0; A < z.length; A++) C = C.replace(z[A][0], z[A][1]);
                                x[D].$.sheet.addRule(y[B][0], C);
                            }
                        } else {
                            C = y;
                            for (A = 0; A < z.length; A++) C = C.replace(z[A][0], z[A][1]);
                            if (g) x[D].$.styleSheet.cssText = C;
                            else x[D].setHtml(C);
                        }
                    }
                };
                var w = /\$color/g;
                i.extend(q, {
                    uiColor: null,
                    rk: function() {
                        return this.uiColor;
                    },
                    setUiColor: function(x) {
                        var y, z, A = u(a.oC),
                            B = u(this.document),
                            C = '.cke_' + q.name.replace('.', '\\.'),
                            D = [C + ' .cke_wrapper', C + '_dialog .cke_dialog_contents', C + '_dialog a.cke_dialog_tab', C + '_dialog .cke_dialog_footer'].join(','),
                            E = 'background-color: $color !important;';
                        if (f.webkit) {
                            y = [
                                [D, E]
                            ];
                            z = [
                                ['body,' + D, E]
                            ];
                        } else {
                            y = D + '{' + E + '}';
                            z = 'body,' + D + '{' + E + '}';
                        }
                        return (this.setUiColor = function(F) {
                            var G = [
                                [w, F]
                            ];
                            q.uiColor = F;
                            v([A], y, G);
                            v([B], z, G);
                            v(r, s, G);
                        })(x);
                    }
                });
                q.on('menuShow', function(x) {
                    var y = x.data[0],
                        z = y.element.eG('iframe').getItem(0).getFrameDocument();
                    if (!z.getById('cke_ui_color')) {
                        var A = u(z);
                        r.push(A);
                        var B = q.rk();
                        if (B) v([A], s, [
                            [w, B]
                        ]);
                    }
                });
                if (q.config.uiColor) q.on('uiReady', function() {
                    q.setUiColor(q.config.uiColor);
                });
            }
        };
    })());
    (function() {
        a.dialog ? p() : a.on('dialogPluginReady', p);

        function p() {
            a.dialog.on('resize', function(q) {
                var r = q.data,
                    s = r.width,
                    t = r.height,
                    u = r.dialog,
                    v = u.bO.contents;
                if (r.skin != 'kama') return;
                v.setStyles({
                    width: s + 'px',
                    height: t + 'px'
                });
                setTimeout(function() {
                    var w = u.bO.dialog.getChild([0, 0, 0]),
                        x = w.getChild(0),
                        y = w.getChild(2);
                    y.setStyle('width', x.$.offsetWidth + 'px');
                    y = w.getChild(7);
                    y.setStyle('width', x.$.offsetWidth - 28 + 'px');
                    y = w.getChild(4);
                    y.setStyle('height', x.$.offsetHeight - 31 - 14 + 'px');
                    y = w.getChild(5);
                    y.setStyle('height', x.$.offsetHeight - 31 - 14 + 'px');
                }, 100);
            });
        };
    })();
    a.skins.add('v1', (function() {
        var p = ['images/loaders/16x16.gif', 'images/loaders/32x32.gif', 'images/ckffolder.gif', 'images/ckffolderopened.gif'];
        if (g && f.version < 7) p.push('images/sprites_ie6.png');
        return {
            ls: p,
            application: {
                css: ['app.css']
            },
            ps: 1,
            rv: -8,
            kN: 0,
            host: {
                qx: 1,
                css: ['host.css']
            }
        };
    })());
    (function() {
        a.dialog ? p() : a.on('dialogPluginReady', p);

        function p() {
            a.dialog.on('resize', function(q) {
                var r = q.data,
                    s = r.width,
                    t = r.height,
                    u = r.dialog,
                    v = u.bO.contents;
                if (r.skin != 'v1') return;
                v.setStyles({
                    width: s + 'px',
                    height: t + 'px'
                });
                setTimeout(function() {
                    var w = u.bO.dialog.getChild([0, 0, 0]),
                        x = w.getChild(0),
                        y = w.getChild(2);
                    y.setStyle('width', x.$.offsetWidth + 'px');
                    y = w.getChild(7);
                    y.setStyle('width', x.$.offsetWidth - 28 + 'px');
                    y = w.getChild(4);
                    y.setStyle('height', x.$.offsetHeight - 31 - 14 + 'px');
                    y = w.getChild(5);
                    y.setStyle('height', x.$.offsetHeight - 31 - 14 + 'px');
                }, 100);
            });
        };
    })();
    a.gc.add('default', (function() {
        return {
            dQ: function(p) {
                var q = p.name,
                    r = p.element,
                    s = p.ff;
                if (!r || s == a.kZ) return;
                p.layout = new a.application.layout(p);
                var t = p.oW('themeSpace', {
                        space: 'head',
                        html: ''
                    }),
                    u = p.oW('themeSpace', {
                        space: 'sidebar',
                        html: ''
                    }),
                    v = p.oW('themeSpace', {
                        space: 'mainTop',
                        html: ''
                    }),
                    w = p.oW('themeSpace', {
                        space: 'mainMiddle',
                        html: ''
                    }),
                    x = p.oW('themeSpace', {
                        space: 'mainBottom',
                        html: ''
                    }),
                    y = p.config.skin.indexOf(','),
                    z = (y == -1 ? p.config.skin : p.config.skin.substr(0, y)) || 'kama',
                    A = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd"><html lang="' + p.lang.LangCode + '" dir="' + p.lang.dir + '">' + '<head>' + '<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />' + t.html + '</head>' + '<body>' + (f.ie6Compat ? '<div id="ckfinder" role="application">' : '<div id="ckfinder" role="application">') + '<!-- 1. CKE Skin class. -->' + '<div class="fake_wrapper cke_skin_' + z + '">' + '<!-- 2. High contrast class. -->' + '<div class="fake_wrapper"><!-- Applicable: hc cke_hc -->' + '<!-- 3. Browser class. -->' + '<div class="fake_wrapper ' + f.cssClass + '">' + '<!-- 4. RTL class. -->' + '<div class="fake_wrapper cke_' + (p.lang.dir == 'ltr' || g && f.version < 8 ? 'ltr' : 'rtl') + '"><!-- Applicable: rtl cke_rtl -->' + '<!-- 5. Layout class. -->' + '<div class="fake_wrapper">' + '<div id="ckfinder_view" class="columns_2"><!-- Applicable: columns_1 columns_2 -->' + '<div id="sidebar_container" class="container" role="region"' + (p.config.sidebarWidth ? ' style="width: ' + i.cssLength(p.config.sidebarWidth) + '"' : '') + '>' + '<div id="sidebar_wrapper" class="wrapper">' + u.html + '</div>' + '</div>' + '<div id="main_container" class="container" role="region">' + v.html + w.html + x.html + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</div>' + '</body>' + '</html>';
                a.log('[THEME] DOM flush using document.write');
                p.document.$.write(A);

                function B() {
                    if (f.ie6Compat) p.layout.oG = p.document.getWindow().eR();
                };
                p.cr('themeLoaded');
                p.cr('uiReady', function() {
                    B();
                    p.cr('appReady', function() {
                        B();
                        if (f.ie8) {
                            var C = p.document.$,
                                D;
                            if (C.documentMode) D = C.documentMode;
                            else {
                                D = 5;
                                if (C.compatMode) if (C.compatMode == 'CSS1Compat') D = 7;
                            }
                            if (D < 8) {
                                var E = '<strong style="color: red;">Forced IE compatibility mode! CKFinder may not look as intended.</strong>',
                                    F = p.plugins.tools;
                                F.showTool(F.addTool(E));
                            }
                        }
                        if (f.ie6Compat) p.document.getWindow().on('resize', B);
                        p.document.getWindow().on('resize', function() {
                            p.layout.ea.call(p.layout);
                        });
                        var G;

                        function H() {
                            G = G || p.document.getHead().eG('link').getItem(0);
                            var I = 0;
                            if (G) try {
                                if (G.$.sheet && G.$.sheet.cssRules.length > 0) I = 1;
                                else if (G.$.styleSheet && G.$.styleSheet.cssText.length > 0) I = 1;
                                else if (G.$.innerHTML && G.$.innerHTML.length > 0) I = 1;
                            } catch (J) {}
                            if (!I) {
                                window.setTimeout(H, 250);
                                return;
                            }
                            if (f.ie6Compat) {
                                B();
                                p.layout.ea();
                                setTimeout(function() {
                                    p.layout.ea();
                                }, 500);
                            } else {
                                p.layout.ea(true);
                                setTimeout(function() {
                                    p.document.getById('ckfinder').removeStyle('visibility');
                                });
                            }
                            return undefined;
                        };
                        H();
                    });
                });
            },
            pu: function(p) {
                var q = i.getNextNumber(),
                    r = k.kE(['<div class="cke_compatibility cke_' + p.name.replace('.', '\\.') + '_dialog cke_skin_', p.gd, '" dir="', p.lang.dir, '" lang="', p.langCode, '"><table class="cke_dialog', ' ' + f.cssClass.replace(/browser/g, 'cke_browser'), ' cke_', p.lang.dir, '" style="position:absolute"><tr><td><div class="%body"><div id="%title#" class="%title"></div><div id="%close_button#" class="%close_button"><span>X</span></div><div id="%tabs#" class="%tabs"></div><table class="%contents"><tr><td id="%contents#" class="%contents"></td></tr></table><div id="%footer#" class="%footer"></div></div><div id="%tl#" class="%tl"></div><div id="%tc#" class="%tc"></div><div id="%tr#" class="%tr"></div><div id="%ml#" class="%ml"></div><div id="%mr#" class="%mr"></div><div id="%bl#" class="%bl"></div><div id="%bc#" class="%bc"></div><div id="%br#" class="%br"></div></td></tr></table>', g ? '' : '<style>.cke_dialog{visibility:hidden;}</style>', '</div>'].join('').replace(/#/g, '_' + q).replace(/%/g, 'cke_dialog_'), a.document),
                    s = r.getChild([0, 0, 0, 0, 0]),
                    t = s.getChild(0),
                    u = s.getChild(1);
                t.unselectable();
                u.unselectable();
                return {
                    element: r,
                    bO: {
                        dialog: r.getChild(0),
                        title: t,
                        close: u,
                        tabs: s.getChild(2),
                        contents: s.getChild([3, 0, 0, 0]),
                        footer: s.getChild(4)
                    }
                };
            },
            destroy: function(p) {
                var q = p.container,
                    r = p.ia;
                q && q.remove();
                for (var s = 0; r && s < r.length; s++) r[s].remove();
                if (p.element) {
                    p.ff == a.fc && p.element.remove();
                    delete p.element;
                }
            }
        };
    })());
    a.application.prototype.vU = function(p) {
        var q = '' + p,
            r = this._[q] || (this._[q] = a.document.getById(q + '_' + this.name));
        return r;
    };
    a.application.prototype.nJ = function(p) {
        var q = /^\d+$/;
        if (q.test(p)) p += 'px';
        var r = this.layout.dV();
        r.setStyle('width', p);
        this.oW('resize');
        this.layout.ea();
    };
    a.application.prototype.resize = function(p, q) {
        this.element.getChild(0).setStyle('height', q + 'px');
        this.element.getChild(0).setStyle('width', p + 'px');
    };
    (function() {
        var p = "\x3c\x64\151\x76\040\143\x6c\141\x73\163\075\x27\166\151\x65\167\040\x74\x6f\157\154\x5f\160\x61\156\x65\x6c\x27\x20\163\164\x79\154\145\075\x27\x70\141\x64\x64\x69\156\x67\072\062\x70\170\073\x64\151\x73\x70\154\x61\x79\072\x62\154\157\143\x6b\040\x21\x69\x6d\x70\157\x72\x74\141\156\164\073\x70\157\x73\151\164\151\x6f\x6e\072\163\x74\x61\x74\151\143\x20\041\x69\155\160\x6f\162\164\x61\x6e\164\073\x63\157\x6c\x6f\x72\x3a\142\154\141\143\153\040\041\x69\155\x70\x6f\x72\164\x61\156\x74\073\142\141\x63\x6b\147\162\x6f\165\156\144\055\x63\x6f\x6c\157\x72\x3a\x77\x68\x69\x74\145\x20\x21\151\155\x70\157\x72\164\x61\156\x74\x3b\x27\076",
            q = "\x3c\x2f\144\x69\x76\076",
            r = p + "\x54\150\x69\163\040\x69\x73\x20\x74\150\145\x20\x44\105\x4d\x4f\x20\166\145\162\x73\x69\x6f\x6e\x20\157\146\040\x43\x4b\x46\151\156\x64\145\x72\x2e\040\x50\x6c\x65\x61\x73\145\040\x76\x69\x73\x69\x74\x20\164\x68\x65\x20\074\141\040\150\162\145\x66\x3d\047\150\164\x74\160\x3a\057\x2f\x63\153\163\x6f\x75\x72\143\x65\056\143\x6f\x6d\057\x63\x6b\x66\151\156\x64\145\x72\047\040\x74\141\x72\147\145\164\x3d\x27\137\x62\x6c\x61\156\x6b\047\076\x43\x4b\x46\151\156\144\145\162\x20\x77\x65\142\x20\163\151\164\145\074\057\141\076\040\x74\157\x20\x6f\x62\164\x61\x69\x6e\040\x61\040\x76\x61\154\x69\144\x20\154\151\x63\145\x6e\163\x65\056" + q,
            s = p + "\x43\113\x46\151\156\x64\x65\x72\x20\x44\145\166\145\x6c\x6f\x70\145\162\040\114\151\x63\145\156\x73\145\x3c\142\x72\x2f\x3e\x4c\151\x63\x65\x6e\163\x65\x64\040\164\157\x3a\040";

        function t(v, w) {
            var x = 0,
                y = 0;
            for (var z = 0; z < v.$.parentNode.childNodes.length; z++) {
                var A = v.$.parentNode.childNodes[z];
                if (A.nodeType == 1) {
                    var B = A == v.$;
                    if (!A.offsetHeight && !B) continue;
                    y++;
                    if (!B) x += A.offsetHeight;
                }
            }
            var C = v.$.offsetHeight - v.$.clientHeight,
                D = (y - 1) * w;
            if (f.ie6Compat && !f.ie8 && !f.ie7Compat) D += w * 2;
            var E = g ? v.$.parentNode.parentNode.parentNode.offsetHeight : v.$.parentNode.offsetHeight,
                F = E - C - x - (D || 0);
            try {
                v.setStyle('height', F + 'px');
            } catch (G) {}
        };

        function u(v) {
            return a.bs.substr(v * 9 % (2 << 4), 1);
        };
        a.application.layout = function(v) {
            this.app = r.length ? v : null;
            this.jB = null;
        };
        a.application.layout.prototype = {
            ea: function(v) {
                if (this.jB) return;
                this.jB = i.setTimeout(function() {
                    a.log('[THEME] Repainting layout');
                    var w = a.bs.indexOf(a.bF.substr(1, 1)) % 5,
                        x = [a.bF.substr(8, 1), a.bF.substr(6, 1)],
                        y = a.bF && a.bF.substr(3, 1) != a.bs.substr((a.bs.indexOf(a.bF.substr(0, 1)) + a.bs.indexOf(a.bF.substr(2, 1))) * 9 % (a.bs.length - 1), 1),
                        z = !!a.ed && x[1] != u(a.ed.length + a.bs.indexOf(x[0]));
                    if (a.bF && 1 == w && a.lS(window.top[a.nd + "\x63\141\x74\151\x6f\x6e"][a.jG + "\163\x74"]) != a.lS(a.ed) || w == 4 || y) {
                        var A = this.dV().getChild(0).getChildren(),
                            B = 0;
                        for (var C = 0; C < A.count(); C++) {
                            if (A.getItem(C).rd("\160\157\x73\151\x74\151\x6f\156") == "\163\164\141\164\151\143") B = 1;
                        }
                        if (!B) this.dV().getChild(0).appendHtml(y || z || w != 4 ? r : s + "\074\x62\x3e" + i.htmlEncode(a.ed) + "\074\x2f\142\076\074\x2f\x64\151\x76\076");
                    }
                    var D = this.pn(),
                        E = this.pS(),
                        F = a.skins.loaded[this.app.gd];
                    if (F.ps && g && f.ie6Compat && !f.ie8) {
                        var G = this.mB(),
                            H = this.dV(),
                            I = 3 * F.kN,
                            J = F.rv ? F.rv : 0,
                            K = this.oG.width - H.$.offsetWidth - I + J;
                        G.setStyle('width', K + 'px');
                    }
                    if (D) t(D, F.mA);
                    if (E) t(E, F.kN);
                    this.jB = null;
                    v = false;
                    this.app.oW('afterRepaintLayout');
                    if (f.ie6Compat) i.setTimeout(function() {
                        this.app.element.$.style.cssText += '';
                    }, 0, this);
                }, v === true ? 0 : 500, this);
            },
            dV: function() {
                var v = this;
                if (!v.kS) v.kS = v.app.document.getById('sidebar_container');
                return v.kS;
            },
            mB: function() {
                var v = this;
                if (!v.lb) v.lb = v.app.document.getById('main_container');
                return v.lb;
            },
            pS: function() {
                var v = this;
                if (typeof v.kK === 'undefined') v.kK = v.app.document.getById('folders_view');
                return v.kK;
            },
            pn: function() {
                var v = this;
                if (typeof v.kD === 'undefined') v.kD = v.app.document.getById('files_view');
                return v.kD;
            }
        };
    })();
})();