 const ACCOUNT_VERIFY_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Email Verification</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #F4F6F8; }
    .container { width: 100%; max-width: 520px; margin: 60px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; }
    .header { background: linear-gradient(90deg, #4C83EE, #22D172); padding: 20px; color: white; text-align: center; font-size: 22px; font-weight: bold; }
    .main-content { padding: 40px 30px; color: #333333; text-align: left; }
    .button {
      display: inline-block;
      width: 100%;
      background: #22D172;
      text-decoration: none;
      padding: 12px 0;
      color: #ffffff;
      font-size: 15px;
      text-align: center;
      font-weight: bold;
      border-radius: 8px;
    }
    .footer { text-align: center; font-size: 12px; color: #888888; padding: 15px 0 25px; }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">Verify your shop</div>
    <div class="main-content">
      <p>Hello <strong>{{name}}</strong>,</p>
      <p>You're just one step away from activating your shop for this email:</p>
      <p style="color: #4C83EE; font-weight: bold;">{{email}}</p>
      <p>Please click the button below to verify your email and activate your shop.</p>
      <a href="{{activationUrl}}" class="button">Activate Shop</a>
      <p style="margin-top: 20px; font-size: 13px; color: #666;">This link is valid for 5 minutes.</p>
    </div>
    <div class="footer">
      &copy; {{year}} YourApp. All rights reserved.
    </div>
  </div>
</body>
</html>
`

 const ACCOUNT_CREATED_TEMPLATE = `
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Shop Created Successfully</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #F4F6F8; }
    .container { width: 100%; max-width: 520px; margin: 60px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; }
    .header { background: linear-gradient(90deg, #22D172, #4C83EE); padding: 20px; color: white; text-align: center; font-size: 22px; font-weight: bold; }
    .main-content { padding: 40px 30px; color: #333333; text-align: left; }
    .button {
      display: inline-block;
      width: 100%;
      background: #4C83EE;
      text-decoration: none;
      padding: 12px 0;
      color: #ffffff;
      font-size: 15px;
      text-align: center;
      font-weight: bold;
      border-radius: 8px;
    }
    .footer { text-align: center; font-size: 12px; color: #888888; padding: 15px 0 25px; }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">Shop Created Successfully</div>
    <div class="main-content">
      <p>Hello <strong>{{name}}</strong>,</p>
      <p>Congratulations! Your shop has been successfully verified and activated.</p>
      <p>You can now log in and start exploring all the amazing features of your shop.</p>
      <a href="{{loginUrl}}" class="button">Go to Dashboard</a>
      <p style="margin-top: 20px; font-size: 13px; color: #666;">If you didn’t create this shop, please ignore this email.</p>
    </div>
    <div class="footer">
      &copy; {{year}} YourApp. All rights reserved.
    </div>
  </div>
</body>
</html>
`;

const USER_ACCOUNT_VERIFY_TEMPLATE=`
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Email Verification</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #F4F6F8; }
    .container { width: 100%; max-width: 520px; margin: 60px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; }
    .header { background: linear-gradient(90deg, #4C83EE, #22D172); padding: 20px; color: white; text-align: center; font-size: 22px; font-weight: bold; }
    .main-content { padding: 40px 30px; color: #333333; text-align: left; }
    .button {
      display: inline-block;
      width: 100%;
      background: #22D172;
      text-decoration: none;
      padding: 12px 0;
      color: #ffffff;
      font-size: 15px;
      text-align: center;
      font-weight: bold;
      border-radius: 8px;
    }
    .footer { text-align: center; font-size: 12px; color: #888888; padding: 15px 0 25px; }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">Verify your account</div>
    <div class="main-content">
      <p>Hello <strong>{{name}}</strong>,</p>
      <p>You're just one step away from activating your account for this email:</p>
      <p style="color: #4C83EE; font-weight: bold;">{{email}}</p>
      <p>Please click the button below to verify your email and activate your account.</p>
      <a href="{{activationUrl}}" class="button">Activate account</a>
      <p style="margin-top: 20px; font-size: 13px; color: #666;">This link is valid for 5 minutes.</p>
    </div>
    <div class="footer">
      &copy; {{year}} YourApp. All rights reserved.
    </div>
  </div>
</body>
</html>
`
const USER_ACCOUNT_CREATED_TEMPLATE=`
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
  <title>Account Created Successfully</title>
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { margin: 0; padding: 0; font-family: 'Open Sans', sans-serif; background: #F4F6F8; }
    .container { width: 100%; max-width: 520px; margin: 60px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); overflow: hidden; }
    .header { background: linear-gradient(90deg, #22D172, #4C83EE); padding: 20px; color: white; text-align: center; font-size: 22px; font-weight: bold; }
    .main-content { padding: 40px 30px; color: #333333; text-align: left; }
    .button {
      display: inline-block;
      width: 100%;
      background: #4C83EE;
      text-decoration: none;
      padding: 12px 0;
      color: #ffffff;
      font-size: 15px;
      text-align: center;
      font-weight: bold;
      border-radius: 8px;
    }
    .footer { text-align: center; font-size: 12px; color: #888888; padding: 15px 0 25px; }
  </style>
</head>

<body>
  <div class="container">
    <div class="header">Account Created Successfully</div>
    <div class="main-content">
      <p>Hello <strong>{{name}}</strong>,</p>
      <p>Congratulations! Your account has been successfully verified and activated.</p>
      <p>You can now log in and start exploring all the amazing features of your account.</p>
      <a href="{{loginUrl}}" class="button">Go to Dashboard</a>
      <p style="margin-top: 20px; font-size: 13px; color: #666;">If you didn’t create this account, please ignore this email.</p>
    </div>
    <div class="footer">
      &copy; {{year}} YourApp. All rights reserved.
    </div>
  </div>
</body>
</html>

`
module.exports = {
  ACCOUNT_VERIFY_TEMPLATE,
  ACCOUNT_CREATED_TEMPLATE,
  USER_ACCOUNT_VERIFY_TEMPLATE,
  USER_ACCOUNT_CREATED_TEMPLATE
};