export default function CardV0() {
    return (
      <>
        <style jsx global>{`
          @keyframes rotate {
            100% {
              transform: rotate(1turn);
            }
          }
  
          .hover-border-card {
            position: relative;
            border-radius: 10px;
            overflow: hidden;
            padding: 3px;
            transition: all 0.3s ease;
          }
  
          .hover-border-card::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: conic-gradient(
              transparent, 
              rgba(168, 85, 247, 0.4), 
              transparent 30%
            );
            opacity: 0;
            transition: opacity 0.3s ease;
          }
  
          .hover-border-card:hover::before {
            opacity: 1;
            animation: rotate 4s linear infinite;
          }
  
          .card-content {
            background: white;
            border-radius: 8px;
            padding: 2rem;
            position: relative;
            z-index: 1;
          }
        `}</style>
        <div className="flex items-center justify-center min-h-[400px] bg-gray-100 p-4">
          <div className="hover-border-card w-full max-w-md shadow-lg">
            <div className="card-content space-y-4">
              <h3 className="text-lg font-semibold text-gray-800">Hover Running Border Card</h3>
              <p className="text-gray-600 text-sm">
                Hover over this card to see the running border effect. The border will appear and rotate around the card when your mouse is over it.
              </p>
              <a href="#" className="block text-purple-600 hover:text-purple-500 transition-colors duration-200 text-sm font-medium">
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </>
    )
  }