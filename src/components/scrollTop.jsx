import { ArrowUp } from 'lucide-react';

export default function ScrollTop() {
  return (
    <button
      onClick={() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
      className="fixed w-[60px] h-[60px] rounded-full bg-white right-4 bottom-7 hover:shadow-black shadow-lg hover:animate-bounce"
    >
      <ArrowUp className="text-black text-[60px] mx-auto size-10" />
    </button>
  );
}
