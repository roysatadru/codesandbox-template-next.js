export const useIsMobile = () => {
    const [isSSR, setIsSSR] = useState(true);
    
    useEffect(() => {
        setIsSSR(false);
    }, []);
    
    const isMobile = isSSR
    ? false
    : navigator.userAgent.match(
        /Android|webOS|iPhone|iPad|iPod|blackberry|Windows Phone/i,
      )
      
    return { isMobile }
}