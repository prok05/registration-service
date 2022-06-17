export enum ESTATUS {
    DRAFT = 'DRAFT',
    PROCESSING = 'PROCESSING',
    SUCCESS = 'SUCCESS'
};

export interface IPerson {
    lastName: string,
    firstName: string,
    secondName: string,
    driverLicense: string,
    email: string
}

export interface IModel {
    id: number,
    name: string
}

export interface IAuto {
    brand: string,
    model: IModel
}

export interface ICity {
    code: string,
    name: string
}

export interface IRequest {
    id: number,
    status: {
        code: ESTATUS
    },
    person: IPerson,
    auto: IAuto,
    city: ICity,
    createDate: string
}