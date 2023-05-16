import React, { useEffect, useRef, useState } from 'react'
import '../scss/components/tuner.scss'
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";



const NitrateStat = ({nitrateLevel, requiredNitrateLevel, depth,barNum, ...props}) => {
    const { t } = useTranslation();

    // if the bar number is even add 1 to it to make it odd
    const [barNumber] = useState(
        barNum %2 ==0 ? barNum + 1 : barNum)
        
    const tunerRef = useRef(null)
    
    const getBarColor = (activeBar, barNumber) => {
        let halfWind = (barNumber-1) / 2;
        //if the activeBar is on the right side of the window
        if (activeBar > halfWind) {
            activeBar = barNumber - activeBar - 1
        }
        // console.log(activeBar, halfWind, halfWind/2)
        if (activeBar === halfWind) {
            return props.success
        }
        if (activeBar < halfWind/2) {
            return props.error
        }
        if (activeBar => halfWind/2) {
            return props.warning
        }
    };

    useEffect(() => {
    
    //barSize: the size of each bar
    let barSize = requiredNitrateLevel * 2 / barNumber ;

    //activeBar: the relevant bar number
    let activeBar =  Math.floor(nitrateLevel / barSize);

    // if the active bar is bigger than the bar number set it to the last bar
    if (activeBar >= barNumber) {
        activeBar = barNumber-1
    }

    //if the active bar is smaller than 0 set it to 0
    if (activeBar < 0) {
        activeBar = 0
    }

    // get the bars and set the active bar
    let bars = tunerRef.current.querySelectorAll('.bar')
    let color = getBarColor(activeBar, barNumber)


    bars.forEach((bar, index) => {
        if (index === activeBar) {
            bar.classList.add(color)
            bar.style.backgroundColor = color
            bar.style.height= "8rem"
        } 
        else {
            bar.style.backgroundColor = 'grey'
            bar.style.height= "4rem"
            bar.classList = bar.classList.contains('mid') ? 'bar mid' : 'bar'
        }

        if (bar.classList.contains('mid')) 
        {
            bar.innerHTML = `${t("Optimal")} ${requiredNitrateLevel} PPM`
            if (index !== activeBar) {
            bar.style.height= "6rem"
            bar.style.backgroundColor = '#c2ffee'
            // set text on mid bar written optimal
            bar.style.textAlign = "center"
            bar.style.color = "white"
            bar.style.display="flex"
            bar.style.justifyContent="center"
            bar.style.alignItems="center"
            bar.style.fontSize=".9rem"
            bar.style.fontWeight="bold"
            bar.style.textShadow="0 0 2px black"
            bar.style.padding="0 .5rem"
            bar.style.transform="translateY(-1rem)"
            }
            
        }
        
    })
    }, [nitrateLevel])
    

  return (
    <div className="tuner" {...props} ref={tunerRef}>
        <p>{depth} <br/>{nitrateLevel} PPM</p>
        <div className="bar-container">
            {
                [...Array(barNumber)].map((e, i) => {

                    return <div key={i} className={`bar
                    ${i === Math.round(barNumber/2)-1  ? 'mid' : ''}
                    `
                    }
                    onClick={(e)=>{
                        let color = getBarColor(i, barNumber)
                        // if the class list contains the color toast message
                        if (e.target.classList.contains(color)) {
                            if (color === props.error) {
                                return toast.error(`${t("Nitrate level is completely out of range")} ${nitrateLevel - requiredNitrateLevel} ${nitrateLevel - requiredNitrateLevel < 0 ? t("less") : t("more")}`)
                            }
                            if (color === props.warning) {
                                return toast.warning(`${t("Nitrate level is a bit out of range")} ${nitrateLevel - requiredNitrateLevel} ${nitrateLevel - requiredNitrateLevel < 0 ? t("less") : t("more")}`)
                            }
                            if (color === props.success) {
                                return toast.success(`${t("Nitrate level is in range")}`)
                            }
                        }
                    }}
                    ></div>
                })
            }
            </div>
    </div>
  )
}

export default NitrateStat