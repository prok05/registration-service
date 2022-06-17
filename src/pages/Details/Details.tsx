import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import useFetchRequests from "../../hooks/useFetchRequests";
import { IRequest } from "../../types/index";
import s from './Details.module.scss';
import okIcon from '../../assets/img/ok-icon.svg';

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { observer } from "mobx-react-lite";

const Details = observer(() => {
    const { id } = useParams();

    const [request, setRequest] = useState<IRequest>();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [date, setDate] = useState<string>('')

    useEffect(() => {
        axios.get<IRequest>('/reg_service/api/v1/requests/' + id)
            .then((res) => {
                setRequest(res.data)
                setDate(res.data.createDate)
                setIsLoading(false)
            })
            .catch((err) => {
                setIsLoading(false);
                toast.error('Нет ответа от сервера')
            })
    }, [])
    return (
        <main>
            <div className="container">
                <div className="content">
                    {isLoading && <div className="overlay"></div>}
                    <div className={s.detailsTitleWrapper}>
                        <img className={s.detailsImg} src={okIcon} alt="" />
                        <h1 className={s.detailsTitle}>Заявка №{request?.id}</h1>
                    </div>
                    <p className={s.detailsText}>
                        Автомобиль: {request?.auto.brand} {request?.auto.model.name}
                    </p>
                    <p className={s.detailsText}>
                        Дата заявки: {new Date(date).toLocaleDateString('ru-RU')}
                    </p>
                    <Link className={s.detailsBackBtn} to='/'>К списку заявок</Link>
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

export default Details;