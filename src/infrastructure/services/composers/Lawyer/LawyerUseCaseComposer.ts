import { AppointmentsRepository } from "@infrastructure/database/repo/appointments.repo";
import { CallLogsRepo } from "@infrastructure/database/repo/callLogs";
import { ChatRepo } from "@infrastructure/database/repo/chat.repo";
import { ClientRepository } from "@infrastructure/database/repo/client.repo";
import { DocumentsRepo } from "@infrastructure/database/repo/documents.repo";
import { LawyerRepository } from "@infrastructure/database/repo/lawyer.repo";
import { ScheduleRepository } from "@infrastructure/database/repo/schedule.repo";
import { SessionsRepository } from "@infrastructure/database/repo/sessions.repo";
import { UserRepository } from "@infrastructure/database/repo/user.repo";
import { LawyerMapper } from "@infrastructure/Mapper/Implementations/LawyerMapper";
import { UserMapper } from "@infrastructure/Mapper/Implementations/UserMapper";
import { LawyerUsecase } from "@src/application/usecases/lawyer.usecase";

export function lawyerUseCaseComposer() {
  const userMapper = new UserMapper();
  const lawyerMapper = new LawyerMapper();
  const userRepo = new UserRepository(userMapper);
  const lawyerRepo = new LawyerRepository(lawyerMapper);
  const clientRepo = new ClientRepository();
  const scheduleRepo = new ScheduleRepository();
  const documentRepo = new DocumentsRepo();
  const appointmentRepo = new AppointmentsRepository();
  const sessionRepo = new SessionsRepository();
  const chatRepo = new ChatRepo();
  const callLogsRepo = new CallLogsRepo();
  const usecase = new LawyerUsecase(
    userRepo,
    clientRepo,
    lawyerRepo,
    scheduleRepo,
    documentRepo,
    appointmentRepo,
    sessionRepo,
    chatRepo,
    callLogsRepo
  );
  return usecase;
}
