// import { IUserRepository } from "@domain/IRepository/IUserRepo";
// import { IRegiserUserUseCase } from "../IRegisterUserUseCase";
// import { User } from "@domain/entities/User";
// import { ResposeUserDto } from "@src/application/dtos/user.dto";
// import { ValidationError } from "@interfaces/middelwares/Error/CustomError";
// import { IPasswordHasher } from "@src/application/providers/PasswordHasher";
// import { IClientRepository } from "@domain/IRepository/I_client.repo";
// import { ILawyerRepository } from "@domain/IRepository/ILawyer.repo";
// import { Client } from "@domain/entities/Client";
// import { Lawyer } from "@domain/entities/Lawyer";

// export class RegisterUserUseCase implements IRegiserUserUseCase {
//   constructor(
//     private userRepo: IUserRepository,
//     private clientRepo: IClientRepository,
//     private lawyerRepo: ILawyerRepository,
//     private passwordHasher: IPasswordHasher
//   ) {}
//   async execute(input: User): Promise<ResposeUserDto> {
//     const existingUser = await this.userRepo.findByEmail(input.email);
//     if (existingUser) {
//       throw new ValidationError("User Already Exists");
//     }
//     const hashedPassword = await this.passwordHasher.hashPassword(
//       input.password
//     );
//     const newUser = User.create(input);
//     newUser.changePassword(hashedPassword);
//     try {
//       const user = await this.userRepo.create(newUser);
//       const client = Client.create({
//         user_id: user.user_id,
//         profile_image: "",
//         address: "",
//         dob: "",
//         gender: "",
//       });
//       await this.clientRepo.create(client);
//       if (input.role === "lawyer") {
//         const lawyerData = Lawyer.create({
//           barcouncil_number: "",
//           certificate_of_practice_number: "",
//           consultation_fee: 0,
//           description: "",
//           documents: "",
//           enrollment_certificate_number: "",
//           experience: 0,
//           practice_areas: [],
//           rejectReason: "",
//           specialisation: [],
//         });
//         await this.lawyerRepo.create(lawyerData);
//       }
//     } catch (error) {}
//   }
// }
