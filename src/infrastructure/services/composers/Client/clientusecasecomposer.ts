import { AddressRepository } from "@infrastructure/database/repo/address.repo";
import { AppointmentsRepository } from "@infrastructure/database/repo/appointments.repo";
import { CallLogsRepo } from "@infrastructure/database/repo/callLogs";
import { ChatRepo } from "@infrastructure/database/repo/chat.repo";
import { ClientRepository } from "@infrastructure/database/repo/client.repo";
import { DisputesRepo } from "@infrastructure/database/repo/Disputes";
import { LawyerRepository } from "@infrastructure/database/repo/lawyer.repo";
import { ReviewRepo } from "@infrastructure/database/repo/review.repo";
import { ScheduleRepository } from "@infrastructure/database/repo/schedule.repo";
import { SessionsRepository } from "@infrastructure/database/repo/sessions.repo";
import { UserRepository } from "@infrastructure/database/repo/user.repo";
import { LawyerMapper } from "@infrastructure/Mapper/Implementations/LawyerMapper";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { CloudinaryService } from "@src/application/services/cloudinary.service";
import { ClientUseCase } from "@src/application/usecases/client.usecase";
import { I_clientUsecase } from "@src/application/usecases/I_usecases/I_clientusecase";

export function ClientUseCaseComposer(): I_clientUsecase {
  const mapper = new UserMapper();
  const lawyerMapper = new LawyerMapper();
  const userRepo = new UserRepository(mapper);
  const clientrepo = new ClientRepository();
  const addressRepo = new AddressRepository();
  const lawyerRepo = new LawyerRepository(lawyerMapper);
  const reviewRepo = new ReviewRepo();
  const scheduleRepo = new ScheduleRepository();
  const appointmentRepo = new AppointmentsRepository();
  const sessionRepo = new SessionsRepository();
  const cloudinaryService = new CloudinaryService();
  const disputesRepo = new DisputesRepo();
  const chatRepo = new ChatRepo();
  const callRepo = new CallLogsRepo();

  const usecase = new ClientUseCase(
    userRepo,
    clientrepo,
    addressRepo,
    lawyerRepo,
    reviewRepo,
    scheduleRepo,
    appointmentRepo,
    sessionRepo,
    cloudinaryService,
    disputesRepo,
    chatRepo,
    callRepo
  );
  return usecase;
}
