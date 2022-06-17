import s from './Header.module.scss';
import logo from '../../assets/img/logo.svg';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <header className={s.header}>
            <div className="container">
                <nav>
                    <Link to="/" className={s.header__link} >
                        <img className={s.header__logo} src={logo} alt="Логотип" width="34" height="37" />
                        Бронирование Автомобилей
                    </Link>
                </nav>
            </div>
        </header>
    )
}

export default Header;