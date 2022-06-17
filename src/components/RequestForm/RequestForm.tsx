import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import axios from "axios";

import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

import Select from "react-select";

import RequestStore from "../../store/RequestStore";
import { IRequest, ICity, IAuto, ESTATUS, IModel } from '../../types/index';

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import s from './RequestForm.module.scss';

const RequestForm = observer(() => {
    const { register, handleSubmit, formState: { errors } } = useForm<IRequest>();
    const navigate = useNavigate();

    // Ф-ция создания новой заявки. Если передается ESTATUS.DRAFT - статус заявки: Черновик.
    const createRequest = (data: any, draft?: ESTATUS.DRAFT) => {
        const newRequest: IRequest = {
            ...data,
            id: RequestStore.requests.length + 1,
            city: {
                code: cityCode,
                name: city
            },
            auto: {
                brand: selectedBrand,
                model: {
                    id: modelId,
                    name: selectedModel
                }
            },
            status: {
                code: draft ? ESTATUS.DRAFT : ESTATUS.PROCESSING
            },
            createDate: new Date().toISOString(),
        }
        return newRequest;
    }

    // Отправка заявки на сервер
    const onSubmit: SubmitHandler<IRequest> = (data) => {
        const newRequest = createRequest(data)
        setIsPending(true)
        const intervalId = setInterval(() => {
            axios.post('/reg_service/api/v1/requests', newRequest)
                .then((res) => {
                    if (res.data.status.code === ESTATUS.SUCCESS) {
                        setIsPending(false);
                        clearInterval(intervalId);
                        navigate('/' + res.data.id);
                    }
                })
                .catch((err) => {
                    clearInterval(intervalId);
                    toast.error('Не удалось отправить заявку');
                    setIsPending(false);
                    console.log(err.message);
                })
        }, 3000)
    };

    // Отправка заявки со стастусом Черновик на сервер
    const onDraft: SubmitHandler<IRequest> = (data) => {
        const newRequest = createRequest(data, ESTATUS.DRAFT);
        setIsPending(true);
        const intervalId = setInterval(() => {
            axios.post('/reg_service/api/v1/requests', newRequest)
                .then((res) => {
                    if (res.data === 'Draft saved') {
                        setIsPending(false);
                        clearInterval(intervalId);
                        navigate('/');
                    }
                })
                .catch((err) => {
                    clearInterval(intervalId);
                    toast.error('Не удалось отправить заявку');
                    setIsPending(false);
                    console.log(err.message);
                })
        }, 3000)
    }

    const [isPending, setIsPending] = useState<boolean>(false);

    // Список городов
    const [cities, setCities] = useState<ICity[]>([]);
    const [city, setCity] = useState<string>('');
    const [cityCode, setCityCode] = useState<string>('');

    // Список автомобилей
    const [cars, setCars] = useState<IAuto[]>([]);
    const [isCarsLoaded, setIsCarsLoaded] = useState<boolean>(false);

    // Опций для селектов
    const [brandOptions, setBrandOptions] = useState<string[]>();
    const [modelOptions, setModelOptions] = useState<IModel[]>();

    // Выбранный бренд
    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [isBrandSelected, setIsBrandSelected] = useState<boolean>(false);

    //Выбранная модель
    const [selectedModel, setSelectedModel] = useState<string>('');
    const [modelId, setModelId] = useState<number>(0);

    useEffect(() => {
        // Получение списка городов
        axios.get<ICity[]>('/reg_service/api/v1/dictionary/cities')
            .then(res => setCities(res.data))
            .catch((err) => {
                console.log(err.mesage);
                toast.error('Нет ответа от сервера');
            })
        // Получение списка автомобилей
        axios.get('/reg_service/api/v1/dictionary/auto')
            .then(res => {
                setCars(res.data);
                setIsCarsLoaded(true);
            })
            .catch((err) => {
                toast.error('Нет ответа от сервера');
                console.log(err.message);
            })

    }, [])

    // Если список автомобилей загружен, задать опции для брендов
    useEffect(() => {
        setBrandOptions(cars.map(car => Object.keys(car)[0]));
    }, [isCarsLoaded])

    // При изменении названия бренда изменяются опции для моделей
    useEffect(() => {
        if (isBrandSelected) {
            const temp = cars.filter(car => Object.keys(car)[0] === selectedBrand);
            const temp1 = Object.values(temp)[0];
            const temp2: any = Object.values(temp1);
            setModelOptions(temp2[0]);
        }
    }, [selectedBrand])

    // При выбора города изменяются состояния с названием и кодом города
    const handeCityChange = (v: any) => {
        setCity(v.label);
        setCityCode(v.value);
    }

    // При выборе названия бренда изменяются состояния с названием и выбранЛиБренд
    const handleBrandChange = (v: any) => {
        setSelectedBrand(v.value);
        setIsBrandSelected(true);
    }

    // При выборе названия модели изменяются состояния с названием и ID модели
    const handleModelChange = (v: any) => {
        setSelectedModel(v.value);
        setModelId(v.id);
    }

    return (
        <form className={s.requestForm} onSubmit={handleSubmit(onSubmit)}>
            {isPending && <div className="overlay"></div>}
            <div className={s.inputWrapper}>
                <input {...register('person.lastName', {
                    required: 'Обязательное поле',
                    pattern: {
                        value: /^[А-ЯЁ][а-яё]*$/,
                        message: 'Фамилия должна начинаться с заглавной буквы и содержать русские буквы'
                    }
                })}
                    className={s.formInput}
                    type="text"
                    placeholder="Фамилия" />
                {errors.person?.lastName && <div className={s.formError}>{errors.person.lastName.message}</div>}
            </div>
            <div className={s.inputWrapper}>
                <input {...register('person.firstName', {
                    required: 'Обязательное поле',
                    pattern: {
                        value: /^[А-ЯЁ][а-яё]*$/,
                        message: 'Имя должно начинаться с заглавной буквы и содержать русские буквы'
                    }
                })}
                    className={s.formInput}
                    type="text"
                    placeholder="Имя" />
                {errors.person?.firstName && <div className={s.formError}>{errors.person.firstName.message}</div>}
            </div>
            <div className={s.inputWrapper}>
                <input {...register('person.secondName', {
                    required: 'Обязательное поле',
                    pattern: {
                        value: /^[А-ЯЁ][а-яё]*$/,
                        message: 'Отчество должно начинаться с заглавной буквы и содержать русские буквы'
                    }
                })}
                    className={s.formInput}
                    type="text"
                    placeholder="Отчество" />
                {errors.person?.secondName && <div className={s.formError}>{errors.person.secondName.message}</div>}
            </div>
            <div className={s.inputWrapper}>
                <input {...register('person.email', {
                    required: 'Обязательное поле',
                    pattern: {
                        value: /^[\w-\\.]+@([\w-]+\.)+[\w-]{2,4}$/,
                        message: 'Введите корректный Email'
                    }
                })}
                    className={s.formInput}
                    type="text"
                    placeholder="Email" />
                {errors.person?.email && <div className={s.formError}>{errors.person.email.message}</div>}
            </div>
            <div className={s.formWrapper}>
                <div className={s.selectWrapper}>
                    <div className={s.inputWrapper}>
                        <input {...register('person.driverLicense', {
                            required: 'Обязательное поле',
                            pattern: {
                                value: /\d\d\d\d\s\d\d\d\d\d\d/,
                                message: 'Номер в формате XXXX XXXXXX'
                            }
                        })}
                            className={s.formInput}
                            type="text"
                            placeholder="Водительское удостоверение"
                        />
                        {errors.person?.driverLicense && <div className={s.formError}>{errors.person.driverLicense.message}</div>}
                    </div>
                    <div className={s.inputWrapper}>
                        <Select
                            className={s.formSelect}
                            placeholder='Город'
                            options={
                                cities.map(city => (
                                    { value: city.code, label: city.name }
                                ))
                            }
                            onChange={handeCityChange}
                        />
                    </div>
                </div>
                <div className={s.selectWrapper}>
                    <div className={s.inputWrapper}>
                        <Select
                            className={s.formSelect}
                            placeholder='Марка автомобиля'
                            options={
                                brandOptions?.map(brand => (
                                    { value: brand, label: brand }
                                ))
                            }
                            onChange={handleBrandChange}
                        />
                    </div>
                    <div className={s.inputWrapper}>
                        <Select
                            className={s.formSelect}
                            placeholder='Модель'
                            options={
                                modelOptions?.map(model => (
                                    { value: model.name, label: model.name, id: model.id }
                                ))
                            }
                            onChange={handleModelChange}
                        />
                    </div>
                </div>
            </div>

            <div className={s.inputWrapper}>
                <label>
                    <input className={s.inputCheckbox} required type="checkbox" />
                    Согласен на обработку персональных данных
                </label>
            </div>

            <div className={s.formBtns}>
                <button onClick={handleSubmit(onDraft)} className={s.formBtn}>Сохранить</button>
                <button className={s.formBtn} type="submit">Отправить на регистрацию</button>
                <Link className={s.formBtn} to='/'>Назад</Link>
            </div>
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
        </form>
    )
})

export default RequestForm;