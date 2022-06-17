import RequestForm from "../../components/RequestForm/RequestForm";
import s from './Create.module.scss';

const CreateHook = () => {
    return (
        <main>
            <div className="container">
                <div className="content">
                    <h1 className={s.createTitle}>Оставить заявку</h1>
                    <p className={s.createText}>Заполните данные формы</p>
                    <RequestForm />
                </div>
            </div>
        </main>
    )
}

export default CreateHook;