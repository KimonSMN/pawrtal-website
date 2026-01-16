export enum MeetingStatus {
    New = "new",
    Accepted = "accepted",
    Completed = "completed",
    Cancelled = "cancelled",
}

/**
 * @description Object to describe meetings
 * @param name Visitor name
 * @param procedure The reason of the meeting
 * @param date date of the appointment
 * @param pet type of pet
 * @param pet_id pet identification
 */
export class Info {
    name: string;
    procedure: string;
    date: Date;
    pet: string;
    pet_id: string;
    status: MeetingStatus;

    constructor(
        name: string,
        procedure: string,
        date: Date,
        pet: string,
        pet_id: string,
        status: MeetingStatus,
    ) {
        this.name = name;
        this.procedure = procedure;
        this.date = date;
        this.pet = pet;
        this.pet_id = pet_id;
        this.status = status;
    }
}

/* RECORDS */
export type PetCondition = "apwleia" | "euresi" | "keno";
export type OwnerStatus = "metavivasi" | "uiothsia" | "anadoxh";
export type Gender = "male" | "female";

export class Record {
    constructor(
        public species: string,
        public ownerName: string,
        public condition: PetCondition,
        public petId: string,
        public age: number,
        public gender: Gender,
        public ownerStatus: OwnerStatus,
        public createdAt: Date = new Date(),
    ) {}
}

/* USERS */
export class User {
    id!: number;
    name!: string;
    email!: string;
    role!: "vet" | "owner";
    phone_number?: string;
    address?: string;
    city?: string;
    afm?: number;
    photo?: string;
    createdAt!: string;

    constructor(data: Partial<User>) {
        Object.assign(this, data);
    }
}
