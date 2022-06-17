import s from './Footer.module.scss'

const Footer = () => {
    return (
        <footer className={s.footer}>
            <div className="container">
                <span className={s.footer__copyright}>Copyritht 2022, Бронирование Автомобилей</span>
            </div>
        </footer>
    )
}

export default Footer;