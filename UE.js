class Ue {
    
    constructor(nom){
        this.id = Ue.incrementId();
        this.nomUe = nom;
    }

    static incrementId(){
        if(!this.latestId){
            this.latestId = 1;
        } 
        else {
            this.latestId++;
        }
        return this.latestId;
    }
}

export default Ue;