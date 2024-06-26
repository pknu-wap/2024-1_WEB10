import { FcGoogle } from 'react-icons/fc'
import { IoLogoGithub } from 'react-icons/io'

import { twMerge } from 'tailwind-merge'

import { AuthenticationRequest, AuthenticationResponse } from '@common/type'
import { IpcSocket } from '@common/socket'

import { CentralizedDiv, Column, Row } from '@view/components/layout/utils/Layout'

const login = async (authInfo: AuthenticationRequest): Promise<AuthenticationResponse> => {
  return await IpcSocket.ipcRenderer.request('authentication/login', authInfo)
}

const emailLogin = async (
  email: string,
  password: string,
  type: 'SignIn' | 'SignUp' = 'SignIn'
): Promise<AuthenticationResponse> => {
  return await login({
    type: 'email',
    email,
    password,
    req: {
      type
    }
  })
}

const googleLogin = async (): Promise<AuthenticationResponse> => {
  return await login({
    type: 'google',
    req: {
      type: 'SignIn'
    }
  })
}

const githubLogin = async (): Promise<AuthenticationResponse> => {
  return await login({
    type: 'github',
    req: {
      type: 'SignIn'
    }
  })
}

const EmailInput = (): JSX.Element => {
  return (
    <div>
      <label htmlFor={'email'} className={twMerge('block text-sm font-medium leading-6')}>
        Email Address
      </label>
      <div className={'mt-2'}>
        <input
          id={'email-input'}
          name={'email'}
          type={'email'}
          autoComplete={'email'}
          required={true}
          className={twMerge(
            'w-full block rounded-md py-1.5 shadow-sm ring-1 ring-inset',
            'focus:ring-2 focus:ring-inset',
            'sm:text-sm sm-leading-6'
          )}
        />
      </div>
    </div>
  )
}

const PasswordInput = (): JSX.Element => {
  return (
    <div>
      <div className={'flex items-center justify-between'}>
        <label htmlFor={'email'} className={twMerge('block text-sm font-medium leading-6')}>
          Password
        </label>
        <div className="text-sm">
          <a href="#" className="font-semibold text-indigo-600 hover:text-indigo-500">
            {/* todo : Sign up */}
            Forgot password?
          </a>
        </div>
      </div>
      <div className={'mt-2'}>
        <input
          id={'password-input'}
          name={'password'}
          type={'password'}
          autoComplete={'current-password'}
          required={true}
          className={twMerge(
            'w-full block rounded-md py-1.5 shadow-sm ring-1 ring-inset',
            'focus:ring-2 focus:ring-inset',
            'sm:text-sm sm-leading-6'
          )}
        />
      </div>
    </div>
  )
}

const SubmitButton = (): JSX.Element => {
  return (
    <div>
      <button
        type={'submit'}
        className={twMerge(
          'w-full flex justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 shadow-sm focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
        )}
      >
        Sign in
      </button>
    </div>
  )
}

const GoogleLoginButton = (): JSX.Element => {
  return (
    <CentralizedDiv className={twMerge('w-[40px] h-[40px] rounded-full')}>
      <button
        onClick={async (): Promise<void> => {
          const res = await googleLogin()
          // fixme: tested -> success : await user social login and response of token
          // if (res.result) {
          //   window.ipc('request-change-window', 'start')
          // }
          res.result
        }}
      >
        {/* todo : 3rd party login */}
        <FcGoogle size={20} />
      </button>
    </CentralizedDiv>
  )
}

const GithubLoginButton = (): JSX.Element => {
  return (
    <CentralizedDiv className={twMerge('w-[40px] h-[40px] rounded-full')}>
      <button
        onClick={async (): Promise<void> => {
          const res = await githubLogin()
          // fixme: tested -> success : await user social login and response of token
          // if (res.result) {
          //   window.ipc('request-change-window', 'start')
          // }
          res.result
        }}
      >
        {/* todo : 3rd party login */}
        <IoLogoGithub size={25} />
      </button>
    </CentralizedDiv>
  )
}

export const EmailLoginForm = (): JSX.Element => {
  return (
    <Column className={'w-[400px] min-h-full px-6 py-12'}>
      <div>
        <h2 className="text-center text-2xl font-bold leading-9 tracking-tight">
          Sign in to your account
        </h2>
      </div>
      <div className={'mt-10'}>
        <form
          className={'space-y-6'}
          onSubmit={async (): Promise<void> => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const email = document.getElementById('email-input')?.value
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const password = document.getElementById('password-input')?.value
            const res = await emailLogin(email, password)
            // fixme: tested -> success : await user social login and response of token
            // if (res.result) {
            //   window.ipc('request-change-window', 'start')
            // }
            res.result
          }}
        >
          {/* todo : onSubmit */}
          <EmailInput />
          <PasswordInput />
          <SubmitButton />
        </form>
        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{' '}
          {/*<a href="#" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">*/}
          {/*  /!* todo : Sign up *!/*/}
          {/*  Start a 14day free trial*/}
          {/*</a>*/}
          {/*  /!* todo : Remove free trial label? *!/*/}
        </p>
        <hr className={'mt-4 border-2 border-b-black'} />
        <Row className={'mt-4 justify-center gap-x-4'}>
          <GoogleLoginButton />
          <GithubLoginButton />
          {/* Guest Button */}
          <button
            className={'w-[40px] h-[40px] rounded-full'}
            // onClick={(): void => IpcSocket.requester.command('windowControl', 'onChangeToStart')}
            // todo : change form
          >
            Guest
          </button>
        </Row>
      </div>
    </Column>
  )
}
