<?php

namespace Jonlil\CKFinderBundle\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

use Jonlil\CKFinderBundle\Tests\ApplicationFixture\AppKernel;

class BundleIntegrationTest extends WebTestCase
{

    protected static function createKernel(array $options = array())
    {
        return new AppKernel('test', true);
    }


    /**
     * @test
     */
    public function itRegistersTheCkfinderFormType()
    {
        $client = self::createClient();

        $container = $client->getKernel()->getContainer();

        $this->assertTrue($container->has('form.type.ckfinder'));
    }


    /**
     * @test
     */
    public function itAllowsTheCreationOfCkfinderForms()
    {
        $client = self::createClient();

        $crawler = $client->request('GET', '/test/form');

        $this->assertEquals(1, $crawler->filter('textarea#form_content')->count());
        $this->assertEquals(1, $crawler->filter('iframe[src="bundles/ivoryckeditor/"]')->count());
    }

}