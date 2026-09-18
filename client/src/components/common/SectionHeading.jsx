import Reveal from './Reveal';

const SectionHeading = ({ 
  eyebrow, 
  title, 
  titleItalic = null, 
  subtitle, 
  align = "center", 
  light = false 
}) => {
  const alignment = align === "center" ? "text-center mx-auto items-center" : "text-left items-start";
  const textColor = light ? "text-white" : "text-primary";
  const subColor = light ? "text-white/60" : "text-muted";
  const eyebrowColor = light ? 'text-accent' : 'text-accent';

  return (
    <Reveal className={`max-w-3xl ${alignment} flex flex-col mb-16`}>
      
      
      {eyebrow && (
        <div className={`flex items-center gap-4 mb-6 ${align === 'center' ? 'justify-center' : ''}`}>
          <div className={`w-8 md:w-12 h-[1px] ${light ? 'bg-accent/60' : 'bg-accent/60'}`} />
          
         
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          
          <span className={`text-[10px] md:text-xs font-bold tracking-[0.35em] uppercase ${eyebrowColor}`}>
            {eyebrow}
          </span>
          
          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
          
          <div className={`w-8 md:w-12 h-[1px] ${light ? 'bg-accent/60' : 'bg-accent/60'}`} />
        </div>
      )}

      <h2 className={`text-4xl md:text-5xl lg:text-6xl font-heading ${textColor} leading-[1.1] tracking-tight`}>
        {title}
        {titleItalic && (
          <>
            {' '}
            <span className="italic font-normal opacity-80">{titleItalic}</span>
          </>
        )}
      </h2>


    </Reveal>
  );
};

export default SectionHeading;