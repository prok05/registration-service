import axios from "axios";
import { useEffect, useState } from "react";
import RequestStore from "../store/RequestStore";
import { IRequest } from "../types/index";

const useFetchRequests = (url: string) => {
    const [data, setData] = useState<IRequest[]>([])
    const [isPending, setIsPending] = useState<boolean>(true)
    const [error, setError] = useState<string>('')

    useEffect(() => {
        const abortCont = new AbortController();
        axios.get(url)
            .then((res) => {
                if (res.status !== 200) {
                    throw Error('Нет ответа от сервера')
                }
                RequestStore.requests = res.data;
                setData(RequestStore.requests);
                setIsPending(false)
            })
            .catch((err) => {
                if (err.name === 'AbortError') {
                    console.log('Не удалось получить данные')
                } else {
                    setIsPending(false)
                    setError('Не удалось загрузить список заявок')
                }
            })
        return () => abortCont.abort();
    }, [url]);
    return { data, isPending, error }
}

export default useFetchRequests;