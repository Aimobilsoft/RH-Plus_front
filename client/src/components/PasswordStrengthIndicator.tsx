interface PasswordStrengthIndicatorProps {
  password: string;
}

const PasswordStrengthIndicator = ({ password }: PasswordStrengthIndicatorProps) => {
  const calculateStrength = (password: string) => {
    let score = 0;
    let feedback = [];

    // Criterios de fortaleza
    if (password.length >= 8) {
      score += 1;
    } else {
      feedback.push("Mínimo 8 caracteres");
    }

    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Incluye minúsculas");
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Incluye mayúsculas");
    }

    if (/\d/.test(password)) {
      score += 1;
    } else {
      feedback.push("Incluye números");
    }

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1;
    } else {
      feedback.push("Incluye símbolos");
    }

    return { score, feedback };
  };

  const getStrengthLabel = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return "Muy débil";
      case 2:
        return "Débil";
      case 3:
        return "Regular";
      case 4:
        return "Fuerte";
      case 5:
        return "Muy fuerte";
      default:
        return "Muy débil";
    }
  };

  const getStrengthColor = (score: number) => {
    switch (score) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-orange-500";
      case 3:
        return "bg-yellow-500";
      case 4:
        return "bg-blue-500";
      case 5:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  const { score, feedback } = calculateStrength(password);
  const strengthLabel = getStrengthLabel(score);
  const strengthColor = getStrengthColor(score);
  const percentage = (score / 5) * 100;

  if (!password) {
    return null;
  }

  return (
    <div className="mt-2 space-y-2">
      {/* Barra de progreso */}
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strengthColor}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {/* Etiqueta de fortaleza */}
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          Fortaleza: <span className={`${strengthColor.replace('bg-', 'text-')}`}>
            {strengthLabel}
          </span>
        </span>
        <span className="text-xs text-gray-500">
          {score}/5 criterios
        </span>
      </div>
      
      {/* Feedback de mejoras */}
      {feedback.length > 0 && (
        <div className="text-xs text-gray-600">
          <span>Sugerencias: </span>
          <span>{feedback.join(", ")}</span>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;