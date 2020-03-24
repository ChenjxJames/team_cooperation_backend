import { UserService } from '../services/user';

interface Result {
  succeeded: boolean,
  info: string,
  error?: any,
  data?: any
}

export class UserControl {
  userService: UserService;
  
  constructor() {
    this.userService = new UserService();
  }

  getUserInfoByCookie = async (ctx: any) => {
    try {
      const data = {
        user_id: ctx.session.user_id,
        username: ctx.session.username,
        email: ctx.session.email
      };
      ctx.body = { succeeded: true, info: 'Get successfully.', data: data};
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  login = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      if (requestBody.username && requestBody.password) {
        let result: any = await this.userService.login(requestBody.username, requestBody.password)
        if (result.succeeded) {
          ctx.session.user_id = result.user_id;
          ctx.session.username = requestBody.username;
          ctx.session.email = result.email;
          const data = {
            user_id: ctx.session.user_id,
            username: ctx.session.username,
            email: ctx.session.email
          };
          ctx.body = { succeeded: true, info: 'Login successfully.', data: data };
        } else {
          ctx.body = { succeeded: false, info: 'Username or password is error.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Username or password is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }

  }

  register = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      if (requestBody.password === requestBody.passwordAffirm && requestBody.username && requestBody.email) {
        if(await this.userService.register(requestBody.username, requestBody.password, requestBody.email)) {
          ctx.body = { succeeded: true, info: 'Register successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Register failed. Please change your username and try again.' };
        }        
      } else {
        ctx.body = { succeeded: false, info: 'Password attirm error.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  logout = async(ctx: any) => {
    ctx.session = null;
    ctx.body = { succeeded: false, info: 'Logout successfully.' };
  }

  changePassword = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      if (requestBody.password === requestBody.passwordAffirm) {
        if(await this.userService.changePassword(ctx.session.username, requestBody.password)) {
          ctx.body = { succeeded: true, info: 'Change password successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Change password failed.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Password attirm error.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  forgetPassword = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body
      if (requestBody.email) {
        if (await this.userService.forgetPassword(requestBody.email)) {
          ctx.body = { succeeded: true, info: 'Reset password email sent successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Wrong email address.' };
        }        
      } else {
        ctx.body = { succeeded: false, info: 'Email is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  getUsernameById = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      if (requestBody.user_id) {
        ctx.body = { succeeded: true, info: 'Get successfully.', data: await this.userService.getUsernameById(requestBody.user_id)};
      } else {
        ctx.body = { succeeded: false, info: 'Id is null.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }

  resetPassword = async (ctx: any) => {
    try {
      let requestBody = ctx.request.body;
      if (requestBody.password === requestBody.passwordAffirm && requestBody.user_id && requestBody.username && requestBody.verification_code) {
        if(await this.userService.resetPassword(requestBody.user_id, requestBody.username, requestBody.password, requestBody.verification_code)) {
          ctx.body = { succeeded: true, info: 'Reset password successfully.' };
        } else {
          ctx.body = { succeeded: false, info: 'Reset password failed. Link invalid.' };
        }
      } else {
        ctx.body = { succeeded: false, info: 'Password attirm error.' };
      }
    } catch (err) {
      console.error(err);
      ctx.body = { succeeded: false, info: 'Server error.', error: err };
    }
  }
}