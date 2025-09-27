type StatusType = "open" | "closed" | "onhold";

export type CaseDto = {
    id: string;
    title: string;
    clientId: string;
    lawyerId: string;
    caseType: string;
    summary?: string;
    estimatedValue?: number;
    nextHearing?: Date;
    status: StatusType;
    createdAt: Date;
    updatedAt: Date;
};
