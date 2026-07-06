import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

// Lista única e filtrada dos ícones que você solicitou
export const ICONES_DISPONIVEIS = [
  'Home', 'Utensils', 'Car', 'Gift', 'Heart', 'Briefcase', 
  'DollarSign', 'Coffee', 'ShoppingBag', 'Landmark', 'Wrench', 
  'Droplet', 'Pizza', 'FileText', 'User', 'Folder', 'Lightbulb',
  'Calendar', 'Tag', 'Wallet', 'CreditCard', 'Trash2'
];

interface Props extends LucideProps {
  nome: string;
}

export function IconeCategorias({ nome, ...props }: Props) {
  // Pega o componente dinamicamente da biblioteca Lucide
  const IconeComponente = (LucideIcons as any)[nome];

  if (!IconeComponente) {
    return <LucideIcons.Folder {...props} />; // Ícone padrão caso não encontre
  }

  return <IconeComponente {...props} />;
}