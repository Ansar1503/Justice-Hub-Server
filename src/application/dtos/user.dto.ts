export class UserDto {
  name: string;
  email: string;
  mobile: string;
  role: "lawyer" | "client" | "admin";

  constructor({ name, email, mobile, role }: UserDto) {
    this.email = email;
    this.mobile = mobile;
    this.name = name;
    this.role = role;
  }
}

export class RegisterUserDto extends UserDto {
  password: string;
  constructor({ name, email, mobile, role, password }: RegisterUserDto) {
    super({ name, email, mobile, role });
    this.password = password;
  }
}

export class ResposeUserDto {
  user_id: string;
  name: string;
  email: string;
  role: "lawyer" | "client" | "admin";
  constructor({ user_id, name, email, role }: ResposeUserDto) {
    this.user_id = user_id;
    this.name = name;
    this.email = email;
    this.role = role;
  }
}
