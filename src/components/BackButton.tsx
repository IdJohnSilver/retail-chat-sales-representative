import { useNavigate } from 'react-router-dom';

export function BackButton() {
  const navigate = useNavigate();

  const handleBack = () => {
    if (window.history.state?.idx > 0) {
      navigate(-1);
    } else {
      navigate('/chats', { replace: true });
    }
  };

  return (
    <button className="back-button" onClick={handleBack}>
      ← Назад
    </button>
  );
}
