<?php

namespace Tests\Unit\Auth;

use App\Auth\Recaller;
use App\Auth\SessionGuard;
use App\Models\User\Token;
use Illuminate\Auth\AuthenticationException;
use Illuminate\Auth\Events\Attempting;
use Illuminate\Auth\Events\Authenticated;
use Illuminate\Auth\Events\Failed;
use Illuminate\Auth\Events\Login;
use Illuminate\Auth\Events\Logout;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;
use Illuminate\Contracts\Cookie\QueueingFactory;
use Illuminate\Contracts\Session\Session;
use Illuminate\Cookie\CookieJar;
use Illuminate\Events\Dispatcher;
use Illuminate\Http\Request;
use Mockery;
use Symfony\Component\HttpFoundation\Cookie;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class SessionGuardTest extends TestCase
{
	/**
	 * @var Session
	 */
	protected $session;

	/**
	 * @var UserProvider
	 */
	protected $provider;

	/**
	 * @var Request
	 */
	protected $request;

	/**
	 * @var SessionGuard
	 */
	protected $guard;

	// ...

	protected function createUserMock()
	{
		return Mockery::mock(Authenticatable::class);
	}

	// ...

	public function testShouldSetRequest()
	{
		$this->guard = new SessionGuard('default', $this->provider, $this->session);

		$this->guard->setRequest(Request::create('/foo', 'GET'));

		$this->assertInstanceOf(Request::class, $this->guard->getRequest());
	}

	// ...

	public function testAuthenticateReturnsUserWhenUserIsNotNull()
	{
		$user = $this->createUserMock();

		$this->guard->setUser($user);

		$this->assertEquals($user, $this->guard->authenticate());
	}

	// ...

	public function testSetUserFiresAuthenticatedEvent()
	{
		$user = $this->createUserMock();

		$this->guard->setDispatcher($events = $this->createDispatcherMock());

		$events->shouldReceive('dispatch')->once()->with(Mockery::type(Authenticated::class));

		$this->guard->setUser($user);

		$this->assertTrue(true);
	}

	public function testAttemptCallsRetrieveByCredentials()
	{
		$this->guard->setDispatcher($events = $this->createDispatcherMock());

		$events->shouldReceive('dispatch')->once()->with(Mockery::type(Attempting::class));

		$events->shouldReceive('dispatch')->once()->with(Mockery::type(Failed::class));

		$this->guard->getProvider()->shouldReceive('retrieveByCredentials')->once()->with(['foo']);

		$this->assertFalse($this->guard->attempt(['foo']));
	}

	// ...

	public function testLoginOnceFailure()
	{
		$guard = Mockery::mock(SessionGuard::class, [
			'default',
			$this->provider,
			$this->session,
		])->makePartial();

		$user = $this->createUserMock();

		$guard->getProvider()->shouldReceive('retrieveByCredentials')->once()->with(['foo'])->andReturn($user);

		$guard->getProvider()->shouldReceive('validateCredentials')->once()->with($user, ['foo'])->andReturn(false);

		$this->assertFalse($guard->once(['foo']));
	}
}
