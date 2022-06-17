import { ESTATUS, IRequest } from '../../types/index';
import s from './RequestItem.module.scss';
import okIcon from '../../assets/img/ok-icon.svg';
import draftIcon from '../../assets/img/cloud-icon.svg';
import processingIcon from '../../assets/img/sync-icon.svg';

interface IRequestItemProps {
    request: IRequest
}

const RequestItem = ({ request }: IRequestItemProps) => {
    return (
        <li className={s.requestItem}>
            <div className={s.requestItemImg}>
                {request.status.code === ESTATUS.SUCCESS &&
                    <img src={okIcon} />}
                {request.status.code === ESTATUS.DRAFT &&
                    <img src={draftIcon} />}
                {request.status.code === ESTATUS.PROCESSING &&
                    <img src={processingIcon} />}
            </div>
            <div className={s.requestItemInfo}>
                <span className={s.requestTitle}>Заявка №{request.id} на автомобиль {request.auto.brand} {request.auto.model.name}</span>
                {request.status.code === ESTATUS.SUCCESS &&
                    <span className={s.requestStatus}>Статус: Успех</span>}
                {request.status.code === ESTATUS.DRAFT &&
                    <span className={s.requestStatus}>Статус: Черновик</span>}
                {request.status.code === ESTATUS.PROCESSING &&
                    <span className={s.requestStatus}>Статус: В обработке</span>}
                <span className={s.requestDate}>
                    Дата: {new Date(request.createDate).toLocaleDateString('ru-RU')}
                </span>
            </div>
        </li>
    )
}

export default RequestItem;