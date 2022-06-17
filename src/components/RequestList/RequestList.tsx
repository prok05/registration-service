import s from './RequestList.module.scss'
import RequestItem from "../RequestItem/RequestItem";
import { ESTATUS, IRequest } from '../../types';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

interface IRequestListProps {
    data: IRequest[],
    error: string,
    isPending: boolean
}

const RequestList = observer(({ data, error, isPending }: IRequestListProps) => {
    return (
        <ul className={s.requestList}>
            {data.map(req => {
                if (req.status.code === ESTATUS.DRAFT) {
                    return (
                        <Link className={s.requestLink} to={`/edit/${req.id}`} key={req.id}>
                            <RequestItem request={req} />
                        </Link>)
                } else {
                    return (
                        <Link className={s.requestLink} to={`/${req.id}`} key={req.id}>
                            <RequestItem request={req} />
                        </Link>)
                }

            })}
        </ul>
    )
})

export default RequestList;