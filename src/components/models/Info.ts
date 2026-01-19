/*
 * classes to store objects from of the db.json
 * each class represents the type of the object in that list list
 */

/* USERS */
export class User {
    id!: string;
    fullName!: string;
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

/* APPOINTMENTS */
export enum MeetingStatus {
    New = "new",
    Accepted = "approved",
    Completed = "completed",
    Cancelled = "cancelled",
}

/**
 * @description Object to describe meetings
 * @param name Visitor name
 * @param procedure The reason of the meeting
 * @param date date constructor -> new Date(year, monthIndex, day, hours)
 * @param pet type of pet
 * @param pet_id pet identification
 */
export class Appointments {
    id: string;
    pet: string;
    petId: string;
    vetId: string;
    ownerId: string;
    reason: string;
    date: Date;
    status: MeetingStatus;

    constructor(
        id: string,
        pet: string,
        petId: string,
        vetId: string,
        ownerId: string,
        reason: string,
        date: Date,
        status: MeetingStatus,
    ) {
        this.id = id;
        this.pet = pet;
        this.petId = petId;
        this.vetId = vetId;
        this.ownerId = ownerId;
        this.reason = reason;
        this.date = date;
        this.status = status;
    }

    static fromJSON(json: any): Appointments {
        return new Appointments(
            json.id,
            json.pet,
            json.petId,
            json.vetId,
            json.ownerId,
            json.reason,
            new Date(json.date),
            json.status,
        );
    }
}

/* RECORDS */
export type PetCondition = "apwleia" | "euresi" | "keno";
export type OwnerStatus = "metavivasi" | "uiothesia" | "anadoxh";
export type Gender = "male" | "female";

export class Record {
    constructor(
        public petName: string,
        public species: string,
        public ownerName: string,
        public ownerEmail: string,
        public condition: PetCondition,
        public petId: string,
        public age: number,
        public gender: Gender,
        public breed: string,
        public ownerStatus: OwnerStatus,
        public hair: string,
        public hairColor: string,
        public animalSize: string,
        public createdAt: Date = new Date(),
    ) {}

    static fromJSON(json: any): Record {
        return new Record(
            json.petName,
            json.species,
            json.ownerName,
            json.ownerEmail,
            json.condition,
            json.petId,
            json.age,
            json.gender,
            json.breed,
            json.ownerStatus,
            json.hair,
            json.hairColor,
            json.animalSize,
            new Date(json.createdAt),
        );
    }
}

/* REVIEW */
export class Reviews {
    id!: string;
    vetId!: string;
    ownerId!: string;
    rating!: number;
    text?: string;
    createdAt!: Date;

    constructor(
        id: string,
        vetId: string,
        ownerId: string,
        rating: number,
        text: string,
        createdAt: Date,
    ) {
        this.id = id;
        this.vetId = vetId;
        this.ownerId = ownerId;
        this.rating = rating;
        this.text = text;
        this.createdAt = createdAt;
    }

    static fromJSON(json: any): Reviews {
        return new Reviews(
            json.id,
            json.vetId,
            json.ownerId,
            json.rating,
            json.text,
            new Date(json.createdAt),
        );
    }
}
