export interface CaseTypeDto {
  id: string;
  name: string;
  practiceareaId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddCasetypeInputDto {
  name: string;
  practiceareaId: string;
}
