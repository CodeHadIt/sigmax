import Link from 'next/link';
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h2>Welcome. Select a collection:</h2>
      <Link href="/sigmax" className="cursor-crosshair">
          <Image
            src="https://ordinals.com/content/8e22dc4497c3361f8c573521e52040c46d8dedb6d0be879478d6bc6d69a614c2i0"
            width={240}
            height={240}
            alt="OSX Logo"
          />
      </Link>
    </main>
  );
}
