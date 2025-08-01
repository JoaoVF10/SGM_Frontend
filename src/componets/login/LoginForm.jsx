import Campo from "../form/Campo";
import ButtonSubmit from "../form/Button";
import {useNavigate} from "react-router-dom";

function FormularioLogin({ onSubmit, matricula, setMatricula, senha, setSenha }) {
    const navigate = useNavigate();

    return (
        <div className="flex justify-center">
            <form onSubmit={onSubmit} className="w-[80%] max-w-[600px] text-left">

                <Campo
                    autoComplete="username"
                    label="Matrícula:"
                    value={matricula}
                    onChange={(e) => setMatricula(e.target.value)}
                />

                <Campo
                    autoComplete="current-password"
                    label="Senha:"
                    type="password"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                />
                <div className="flex justify-center">

                    <ButtonSubmit color='color' type="button" onClick={() => navigate('/cadastrarAluno')}>Cadastrar</ButtonSubmit>
                    <ButtonSubmit>Entrar</ButtonSubmit>
                </div>

            </form>
        </div>
    );
}

export default FormularioLogin;