import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import RequestList from "../../components/RequestList/RequestList";
import useFetchRequests from "../../hooks/useFetchRequests";
import RequestStore from "../../store/RequestStore";

import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import s from './Home.module.scss'

const Home = observer(() => {
    const { data: data, error, isPending } = useFetchRequests('/reg_service/api/v1/requests');
    const [hasProcessing, setHasProcessing] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get<boolean>('/reg_service/api/v1/requests/processing')
            .then(res => setHasProcessing(res.data))
            .catch(err => {
                toast.error('Нет ответа от сервера');
                console.log(err.mesage)
            })
    }, [RequestStore.requests])

    if (error) {
        toast.error('Не удалось загрузить список заявок')
    }

    const handleNewRequest = () => {
        if (hasProcessing) {
            toast.warning('Вы не можете создать новую заявку пока старая находится в обработке')
        } else {
            navigate('/create')
        }
    }
    return (
        <main>
            <div className="container">
                <div className="content">
                    {isPending && <div className="overlay"></div>}
                    <h1 className={s.homeTitle}>Список заявок</h1>
                    <p className={s.homeText}>Ваши заявки на покупку автомобилей</p>
                    <RequestList data={data} error={error} isPending={isPending} />

                    {!error &&
                        <button className={s.homeCreateBtn} onClick={handleNewRequest}>Создать заявку</button>
                    }
                    {error &&
                        <button className={s.homeCreateBtn} disabled>Создать заявку</button>
                    }
                    <ToastContainer
                        position="bottom-right"
                        autoClose={3000}
                        hideProgressBar={true}
                        newestOnTop={true}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                    />
                </div>
            </div>
        </main>
    )
})

export default Home;