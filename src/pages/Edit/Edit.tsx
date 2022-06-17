import { observer } from 'mobx-react-lite';
import RequestEditForm from '../../components/RequestEditForm/RequestEditForm';
import s from './Edit.module.scss';

const Edit = observer(() => {
    return (
        <main>
            <div className="container">
                <div className="content">
                    <h1 className={s.editTitle}>Оставить заявку</h1>
                    <p className={s.editText}>Заполните данные формы</p>
                    <RequestEditForm />
                </div>
            </div>
        </main>
    )
})

export default Edit;