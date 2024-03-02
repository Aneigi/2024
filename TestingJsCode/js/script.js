let postion = new Map();

function startPosition(object) {
    return {
        firstParent: object.parentNode,
        nextElement: object.nextSibling
    }
}

function dynamicAdaptive() {
    const dataObjects = document.querySelectorAll("[data-object]");

    dataObjects.forEach(object => {
        const [targetClass, breakPoint] = object.getAttribute('data-object').split(', ').map(item => item.trim());
        const targetObject = document.querySelector(targetClass);
        const commentSelect = Array.from(targetObject.childNodes)
            .find(node => node.nodeType === Node.COMMENT_NODE && node.textContent.trim() === 'here');

        if (!postion.has(object))
            postion.set(object, startPosition(object));

        const { firstParent, nextElement } = postion.get(object);
        const condition = window.innerWidth <= breakPoint && commentSelect;

        condition ? targetObject.insertBefore(object, commentSelect.nextSibling) : 
            firstParent.insertBefore(object, nextElement);
    });
}

window.addEventListener('load', dynamicAdaptive);
window.addEventListener('resize', dynamicAdaptive);

//================================================================================

document.addEventListener('DOMContentLoaded', () => {
    const dataScroll = document.querySelectorAll("[data-scroll]");
    const fixedMenuHeight = document.querySelector('nav').offsetHeight;
    

    function scrollToObject() {
        dataScroll.forEach(object => {
            const targetClass = object.getAttribute('data-scroll');
            const targetObject = document.querySelector(targetClass);

            if (targetObject)
                object.addEventListener('click', () => {
                    const targetOffset = targetObject.getBoundingClientRect().top + window.pageYOffset - fixedMenuHeight;
                    window.scrollTo({ top: targetOffset, behavior: 'smooth' });
                    event.preventDefault();
                });
        });
    }
    scrollToObject();
});
//================================================================================

function visibleElement() {
    const dataView = document.querySelectorAll("[data-view]");

    dataView.forEach(object => {
        const objectHeight = object.offsetHeight;
        const objectOffSet = offset(object).top;
        const startTime = 30;
        const objectAttribute = object.getAttribute('data-view');
     
        let formula = window.innerHeight - objectHeight / startTime;
        if(objectHeight > window.innerHeight) {
            formula= window.innerHeight - window.innerHeight / startTime;
        }

        const condition = (pageYOffset > objectOffSet - formula) && pageYOffset < (objectOffSet + objectHeight);

        if (objectAttribute == "navigator") {
            const dataScroll = document.querySelectorAll("[data-scroll]");
            dataScroll.forEach(element => {
                const targetClass = element.getAttribute('data-scroll');

                if (`.${object.getAttribute('class')}` == targetClass) {

                    if (condition) {
                        element.classList.add('nav-visible');
                    } else {
                        element.classList.remove('nav-visible');
                    }
                }
            });
        } else {
            if (condition) {
                object.classList.add('visible');
            } else {
                object.classList.remove('visible');
            }
        }        
        
        
    });
}

window.addEventListener('scroll', visibleElement);


function offset(element) {
    const rect = element.getBoundingClientRect(),
        scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
        scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return {top: rect.top + scrollTop, left: rect.left + scrollLeft}
}

//================================================================================