import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export function Brand() {
  return <Link href="/" className="brand" aria-label="SkillUp — на главную">
    <span className="brand-mark"><ArrowUpRight size={23} strokeWidth={2.5} /></span>
    <span>skillup<span className="brand-dot">.</span></span>
  </Link>;
}
