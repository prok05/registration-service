import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import axios from "axios";

import { SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router-dom";

import Select from "react-select";

import { ESTATUS, IAuto, ICity, IRequest, IModel } from "../../types/index";

import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import s from './RequestEditForm.module.scss';

const RequestEditForm = observer(() => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [request, setRequest] = useState<IRequest>();
    const { register, handleSubmit, reset, formState: { errors } } = useForm<IRequest>({
        defaultValues: request,
    });

    // Ф-ция создания новой заявки. Если передается ESTATUS.DRAFT - статус заявки: Черновик.
    const createRequest = (data: any, draft?: ESTATUS.DRAFT) => {
        const newRequest: IRequest = {
            ...data,
            id: requestId, // ID черновика
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
        const newRequest = createRequest(data);
        setIsPending(true);
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
                    toast.error('Нет ответа от сервера');
                    setIsPending(false);
                    console.log(err.message);
                })
        }, 3000)
    }

    // Редактирование черновика
    const onDraft: SubmitHandler<IRequest> = (data) => {
        const newRequest = createRequest(data, ESTATUS.DRAFT);
        setIsPending(true);
        axios.put('/reg_service/api/v1/requests/' + requestId, newRequest)
            .then((res) => {
                if (res.status === 200) {
                    setIsPending(false);
                    navigate('/');
                }
            })
            .catch((err) => {
                setIsPending(false);
                console.log(err.message);
                toast.error('Нет ответа от сервера');
            })
    };

    // Данные черновика
    const [requestId, setRequestId] = useState<number>(0);
    const [defaultCity, setDefaultCity] = useState<object>({});
    const [defaultModel, setDefaultModel] = useState<object>({});
    const [defaultBrand, setDefaultBrand] = useState<object>({});

    const [cities, setCities] = useState<ICity[]>([]);
    const [city, setCity] = useState<string>('');
    const [cityCode, setCityCode] = useState<string>('');

    const [cars, setCars] = useState<IAuto[]>([]);
    const [isCarsLoaded, setIsCarsLoaded] = useState<boolean>(false);

    const [brandOptions, setBrandOptions] = useState<string[]>();
    const [modelOptions, setModelOptions] = useState<IModel[]>();

    const [selectedBrand, setSelectedBrand] = useState<string>('');
    const [isBrandSelected, setIsBrandSelected] = useState<boolean>(false);

    const [selectedModel, setSelectedModel] = useState<string>('');
    const [modelId, setModelId] = useState<number>(0);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPending, setIsPending] = useState<boolean>(false);

    useEffect(() => {
        axios.get<IRequest>('/reg_service/api/v1/requests/' + id)
            .then((res) => {
                setRequest(res.data);
                // Заполнение селектов данными из черновика
                setDefaultCity({ value: res.data.city.code, label: res.data.city.name });
                setDefaultBrand({ value: res.data.auto.brand, label: res.data.auto.brand });
                setDefaultModel({
                    value: res.data.auto.model.name,
                    label: res.data.auto.model.name,
                    id: res.data.auto.model.id
                });

                // Данные из черновика для города, бренда, модели
                setCity(res.data.city.name);
                setCityCode(res.data.city.code);
                setSelectedBrand(res.data.auto.brand);
                setSelectedModel(res.data.auto.model.name);
                setModelId(res.data.auto.model.id);
                setRequestId(res.data.id);

                // Заполнение данных о человеке из черновика
                reset(res.data);

                setIsLoading(false);
            })
            .catch((err) => {
                toast.error('Нет ответа от сервера');
                console.log(err.message);
            })
        // Получение списка городов
        axios.get<ICity[]>('/reg_service/api/v1/dictionary/cities')
            .then(res => setCities(res.data))
            .catch((err) => {
                toast.error('Нет ответа от сервера');
                console.log(err.message);
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
        <main>
            <div className="container">
                <div className="content">
                    <form className={s.requestForm} onSubmit={handleSubmit(onSubmit)}>
                        {isPending && <div className="overlay"></div>}
                        <div className={s.inputWrapper}>
                            <input
                                {...register('person.lastName', {
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
                            <input
                                {...register('person.firstName', {
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
                            <input
                                {...register('person.secondName', {
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
                            <input
                                {...register('person.email', {
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
                                    <input
                                        {...register('person.driverLicense', {
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
                                    {!isLoading &&
                                        <Select
                                            className={s.formSelect}
                                            placeholder='Город'
                                            defaultValue={defaultCity}
                                            options={
                                                cities.map(city => (
                                                    { value: city.code, label: city.name }
                                                ))
                                            }
                                            onChange={handeCityChange}
                                        />
                                    }
                                </div>
                            </div>
                            <div className={s.selectWrapper}>
                                <div className={s.inputWrapper}>
                                    {!isLoading &&
                                        <Select
                                            className={s.formSelect}
                                            placeholder='Марка автомобиля'
                                            defaultValue={defaultBrand}
                                            options={
                                                brandOptions?.map(brand => (
                                                    { value: brand, label: brand }
                                                ))
                                            }
                                            onChange={handleBrandChange}
                                        />
                                    }
                                </div>
                                <div className={s.inputWrapper}>
                                    {!isLoading &&
                                        <Select
                                            className={s.formSelect}
                                            placeholder='Модель'
                                            defaultValue={defaultModel}
                                            options={
                                                modelOptions?.map(model => (
                                                    { value: model.name, label: model.name, id: model.id }
                                                ))
                                            }
                                            onChange={handleModelChange}
                                        />
                                    }
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
                </div>
            </div>
        </main>
    )
})

export default RequestEditForm;