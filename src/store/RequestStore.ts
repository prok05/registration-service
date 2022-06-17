import { makeObservable, observable } from "mobx";
import { IRequest } from "../types";

class RequestStore {
    requests: IRequest[] = [];

    constructor() {
        makeObservable(this, {
            requests: observable,
        })
    }
}

export default new RequestStore();