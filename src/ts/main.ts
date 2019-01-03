import SubjectBuilder from './SubjectBuilder'
import  {OPSYSMBOL,Subject} from "./interface"

window.onload = function(){
    const subjects = new SubjectBuilder(OPSYSMBOL.ADD,3);
    let opSymbol = document.getElementById("opSymbol");
    let op1 = document.getElementById("op1");
    let op2 = document.getElementById("op2");
    
    const updateSubject=(curSubject:Subject)=>{
        opSymbol.innerHTML = curSubject.op.toString();
        op1.innerHTML = curSubject.op1.toString()
        op2.innerHTML = curSubject.op2.toString()
    }

    const initSubjectStatus=(subjectList:SubjectBuilder)=>{
        let doc = document.getElementById("subjectStatus");
        let resultMap = subjectList.list.map((item,index)=>{
            let span = document.createElement("span");
            span.className="normal";
            doc.appendChild(span);
        })
    }

    const updateSubjectStatus=(subjectList:SubjectBuilder)=>{
        let doc = document.getElementById("subjectStatus");
        let rs = doc.querySelectorAll("span");
        // console.info(rs)

        let index = subjectList.currentIndex -1 ;
        rs[index].className = subjectList.list[subjectList.currentIndex-1].isRight ? "yes" :"no"


    }
    let curSubject = subjects.getSubject();

    updateSubject(curSubject);
    initSubjectStatus(subjects)

    document.getElementById("ansBox").focus()


    document.getElementById("getNext").addEventListener("click",()=>{
        let rs = parseInt( document.getElementById("ansBox").value );

        console.info(rs)
        curSubject.setAns(rs)
        updateSubjectStatus(subjects)
        
        console.info(curSubject);
        
        curSubject = subjects.getSubject();
        if(curSubject){
            
            document.getElementById("ansBox").value = ''
            document.getElementById("ansBox").focus()
            updateSubject(curSubject);
        }
        else{
            document.getElementById("getNext").style.display = "none"
        }
    
    })
}
