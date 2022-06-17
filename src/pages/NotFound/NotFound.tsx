import { Link } from "react-router-dom";

const NotFound = () => {
    return (
        <main>
            <div className="container">
                <div className="content">
                    <p>Страница не найдена</p>
                    <Link to='/'>Вернуться на главную страницу</Link>
                </div>
            </div>
        </main>
    )
}

export default NotFound;