<?php

namespace Tests\Feature;

use App\Device;
use App\Models\Code;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Response;
use Tests\TestCase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CodeTest extends TestCase
{
	public function testResendLoginCodeIsUnavailableWhenPhoneIsNull()
	{
		$this
			->withSession(['login.phone' => null])
			->json('POST', route('code.resend.login'))
			->assertStatus(Response::HTTP_BAD_REQUEST)
			->assertJsonStructure([
				'error' => [
					'message',
				],
			]);
	}

	public function testResendLoginCodeIsNotAcceptedWhenTimeoutIsNotOut()
	{
		$this
			->json('POST', route('login'), ['phone' => '79999999998'])
			->assertStatus(Response::HTTP_OK);

		$this->assertDatabaseHas('codes', [
			'user_id' => 2,
		]);

		$this
			->json('POST', route('code.resend.login'))
			->assertStatus(Response::HTTP_NOT_ACCEPTABLE)
			->assertJsonStructure([
				'error' => [
					'message',
				],
			]);
	}

	// ...

	public function testResendSignUpCodeIsUnavailableWhenUserIsNotUnique()
	{
		User::firstOrCreate([
			'phone'      => '79999999901',
			'first_name' => 'Sam',
		]);

		$this
			->withSession(['signup.input' => ['phone' => '79999999901']])
			->json('POST', route('code.resend.signup'))
			->assertStatus(Response::HTTP_UNPROCESSABLE_ENTITY)
			->assertJsonStructure([
				'error' => [
					'message',
				],
			]);

		User
			::where('phone', '79999999901')
			->delete();
	}

	public function testResendSignUpCodeIsNotAcceptedWhenTimeoutIsNotOut()
	{
		$code = Code::firstOrNew([
			'phone'       => '79999999901',
			'type'        => Code::TYPE_SIGN_UP,
			'device_hash' => Device::getUserAgentHash(),
		]);

		$code->created_at = Carbon::now();

		$code->save();

		$this
			->withSession(['signup.input' => ['phone' => '79999999901']])
			->json('POST', route('code.resend.signup'))
			->assertStatus(Response::HTTP_NOT_ACCEPTABLE)
			->assertJsonStructure([
				'error' => [
					'message',
				],
			]);
	}
	// ...
}
