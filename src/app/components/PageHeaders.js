export default function PageHeaders({ h1Text = "Hello", h2Text = "SubHeader" }) {
    return (
      <section className="text-center mt-12 sm:mt-24 mb-4 sm:mb-8">
        <h1
          className="text-xl sm:text-3xl transition duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        >
          {h1Text}
        </h1>
        <h2
          className="text-white/75 text-sm sm:text-base transition duration-300 hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]"
        >
          {h2Text}
        </h2>
      </section>
    );
  }
  