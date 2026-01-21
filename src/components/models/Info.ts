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
    Canceled = "canceled",
}

export type NotifyOptions = "vet" | "user" | "none";
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
    petName: string;
    vetId: string;
    vetName: string;
    ownerId: string;
    reason: string;
    date: Date;
    status: MeetingStatus;
    notify: NotifyOptions;

    constructor(
        id: string,
        pet: string,
        petId: string,
        petName: string,
        vetId: string,
        vetName: string,
        ownerId: string,
        reason: string,
        date: Date,
        status: MeetingStatus,
        notify: NotifyOptions,
    ) {
        this.id = id;
        this.pet = pet;
        this.petId = petId;
        this.petName = petName;
        this.vetId = vetId;
        this.vetName = vetName;
        this.ownerId = ownerId;
        this.reason = reason;
        this.date = date;
        this.status = status;
        this.notify = notify;
    }

    static fromJSON(json: any): Appointments {
        return new Appointments(
            json.id,
            json.pet,
            json.petId,
            json.petName,
            json.vetId,
            json.vetName,
            json.ownerId,
            json.reason,
            new Date(json.date),
            json.status,
            json.notify,
        );
    }
}

/* PETS */

export const PET_OPTIONS = {
    dog: "Σκύλος",
    cat: "Γάτα",
    other: "Άλλο",
};

export type PetCondition = "apwleia" | "euresi" | "keno";
export type Gender = "male" | "female";

export class Pets {
    constructor(
        public name: string,
        public owenerEmail: string,
        public vetId: string,
        public species: string,
        public breed: string,
        public age: number,
        public gender: Gender,
        public microchip: string,
        public color: string,
        public coat: string,
        public birthDate: Date,
        public lastSeenDate: string,
        public location: string,
        public description: string,
        public createdAt: Date = new Date(),
    ) {}

    static fromJSON(json: any): Pets {
        return new Pets(
            json.name,
            json.owenerEmail,
            json.vetId,
            json.species,
            json.breed,
            json.age,
            json.gender,
            json.microchip,
            json.color,
            json.coat,
            json.birthDate,
            json.lastSeenDate,
            json.location,
            json.description,
            new Date(json.createdAt),
        );
    }
}

/* RECORDS */
export const PROCEDURE_OPTIONS = {
    checkup: "Γενικός έλεγχος",
    vaccination: "Εμβολιασμός",
    deworming: "Αποπαρασίτωση",
    microchip: "Τοποθέτηση microchip",
    neutering: "Στείρωση",
    blood_tests: "Αιματολογικές εξετάσεις",
    urine_tests: "Εξετάσεις ούρων",
    imaging: "Ακτινογραφία / Υπέρηχος",
    sick: "Ασθένεια / Συμπτώματα ίωσης",
    injury: "Τραυματισμός",
    chronic_condition: "Χρόνια πάθηση",
    pregnancy: "Κύηση",
    emergency: "Έκτακτο",
    other: "Άλλος λόγος",
};

export type OwnerStatus = "metavivasi" | "uiothesia" | "anadoxh";

export class Record {
    constructor(
        public id: string,
        public vetId: string,
        public vetName: string,
        public petName: string,
        public microchip: string,
        public ownerName: string,
        public reason: string,
        public ownerStatus: OwnerStatus,
        public createdAt: Date = new Date(),
    ) {}

    static fromJSON(json: any): Record {
        return new Record(
            json.id,
            json.vetId,
            json.vetName,
            json.petName,
            json.microchip,
            json.ownerName,
            json.reason,
            json.ownerStatus,
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
