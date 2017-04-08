'use strict';

const bcrypt = require('bcryptjs');
const csurf = require('csurf');
const path = require('path');

const User = require('../models/User');

const model = new User();

class AuthenticationController {
  index(request, response) {
    const token = request.csrfToken();
    
    response.locals.csrfToken = token;
    
    if (request.session && request.session.user) {
      request.session.user.password = '';
      request.session.reset();
    }
    
    response.render(path.join('authentication', 'index.ejs'), {
      model: {
        title: 'Login in/Sign up',
        content: 'Authentication',
        error: ''
      },
    });
  }
  
  login(request, response) {
    const token = request.csrfToken();
    
    model.selectUser({name: request.body.user_login_name.trim()}, (err, result) => {
      const password = request.body.user_login_password.trim();
      
      if (err || !result) {
        response.locals.error = {title: 'Given username was not found.'};
        response.locals.csrfToken = token;
        response.render(path.join('authentication', 'index.ejs'), {
          model: {
            title: 'Login in/Sign up',
            content: 'Authentication',
          },
        });
        return ;
      }
      
     bcrypt.compare(password, result.password, (error, identical) => {
       if (identical == true) {
         response.locals.csrfToken = token;
         request.session.user = result;
         console.log(request.session)
         response.redirect('/home');
         console.log('go home, boy')
         return ;
       }
       
       response.locals.csrfToken = token;
       response.locals.user = result;
       response.locals.error = {'title': 'Incorrect password.'};
       response.render(path.join('authentication', 'index.ejs'), {
          model: {
            title: 'Login in/Sign up',
            content: 'Authentication',
          },
        });
      });
      
    });
  }
  
  register(request, response) {
    const token = request.csrfToken();
    const password = request.body.user_signup_password_first.trim();
    
    if (password !== request.body.user_signup_password_second.trim()) {
      response.locals.tryagain = {name: request.body.user_signup_name, email: request.body.user_signup_email};
      response.locals.csrfToken = token;
      response.locals.error = {title: 'Passwords don\'t match'};
      response.render(path.join('authentication', 'index.ejs'), {
        model: {
          title: 'Login in/Sign up',
          content: 'Authentication',
        },
      });
    }
    else {
      bcrypt.genSalt(10, (err, salt) => {
        if (err) {
          console.error(err);
          return;
        }
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            console.error(err);
            return ;
          }
          
          model.insert({name: request.body.user_signup_name.trim(), password: hash, email: request.body.user_signup_email.trim()}, (err, result) => {
            if (err) {
              if (err.code === 11000) {
                response.locals.error = {title: `${err.errmsg.split(':')[2].split(' ')[1].split('_')[0]} already taken`};
              }
              else
                response.locals.error = {title: 'Something went wrong while proccessing your request. Unable to reqister'};
              
              response.locals.tryagain = {name: request.body.user_signup_name, email: request.body.user_signup_email};
              response.locals.csrfToken = token;
              response.render(path.join('authentication', 'index.ejs'), {
                model: {
                  title: 'Login in/Sign up',
                  content: 'Authentication',
                },
              });
              return ;
            }
            
            response.render(path.join('authentication', 'succes.ejs'), {
              model: {
                'title': 'Succesful registration',
                'name':  request.body.user_signup_name
            }});
          })
        });
      })
    }
  }
  
  logout(request, response) {
    request.session.reset();
    response.redirect('/authentication');
  }
}

module.exports = AuthenticationController;