import { Component, OnInit,OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { FirebaseObjectObservable} from 'angularfire2';
import { Observable } from 'rxjs/Observable';

import { SharedComponent } from './../../shared/shared.component';
import { CreateService } from './../create.service';
import { user } from './../../model/user';
import { list } from './../../model/user';

@Component({
    selector: 'create',
    templateUrl: './create.component.html',
    styleUrls: ['./create.component.scss'],
    providers:[CreateService,MdSnackBar]
})
export class CreateComponent implements OnInit,OnDestroy {
    // shoppingList :list; 
    model=new list(false);
    title:string;
    users=[];
    usersFirebase=[];
    initialEmail:string;
    inviteUsers:Array<string>;
    emailedUsers:Array<any>=[];
    languages = ['Select catalog language','English', 'German'];
    exists:user[];
    notexists:user[];
    array:Array<any>=[];
    sList:FirebaseObjectObservable<any>;
    reqSubscribe;
    sListKey:string;
    snackBar;
    constructor(
        public _createService: CreateService,
        private router: Router,snackBar: MdSnackBar) {
            this.router=router;
            this.snackBar=snackBar;
    }

    ngOnInit() {
        this.model.language=this.languages[0];
        // get all users
        this.getUsers();
        // add articles
        this.addArticles();
    }
    addArticles() {
        let catalog =
            {"Fruits & Vegetables": ["Apples", "Apricot", "Artichokes", "Asparagus", "Aubergine", "Avocado", "Bananas", "Basil", "Beetroot", "Berries", "Blackberries", "Blueberries", "Broccoli", "Cabbage", "Carrots", "Cauliflower", "Celery", "Cherries", "Cherry tomatoes", "Chillies", "Chives", "Coriander", "Courgette", "Cranberries", "Cucumber", "Dates", "Fennel", "Figs", "Fruits", "Garlic", "Ginger", "Grapefruit", "Grapes", "Herbs", "Kiwi fruit", "Leek", "Lemon", "Lettuce", "Lime", "Mandarins", "Mango", "Melon", "Mint", "Mushrooms", "Nectarine", "Olives", "Onions", "Orange", "Parsley", "Passion fruit", "Peach", "Pears", "Peas", "Pepper", "Pineaple", "Plums", "Potatoes", "Pumpkin", "Radish", "Raspberries", "Rhubarb", "Rocket", "Sage", "Salad", "Scallions", "Spinach", "Strawberries", "Sun-dried tomatoes", "Sweet Potatoes", "Sweet corn", "Thyme", "Tomatoes", "Vegetables", "Watermelon"],
             "Bread & Pastries": ["Bagels", "Baguette", "Bread", "Bred roll", "Burns", "Crispbread", "Croissant", "Crumpets", "Dinner rolles", "English Muffins", "Pancakes mix", "Pie", "Pizza dough", "Puff pastry", "Pumpkin Pie", "Scones", "Sliced bread", "Toast", "Tortillas", "Waffles"],
             "Milk & Cheese": ["Blue cheese", "Butter", "Cheddar", "Cheese", "Clotted cream", "Cottage cheese", "Cream", "Cream cheese", "Creme fraiche", "Eggs", "Feta", "Gorgonzola", "Grated cheese", "Margarine", "Mascarpone", "Milk", "Mozarella", "Parmesan"],
             "Meat & Fish": ["Anchovies", "Bacon", "Beef", "Bratwurst", "Chicken", "Chicken breast", "Cold cuts", "Fish", "Ham", "Lamb", "Lobster", "Meat", "Minced meat", "Mussels", "Oysters", "Pork", "Prawns", "Prosciutto", "Salami", "Salmon", "Sausage", "Sliced beef", "Steak", "Tuna", "Turkey", "Turkey breast", "Veal"],
             "Ingredients & Spices": ["Almonds", "BBQ sauce", "Baking powder", "Balsamic vinegar", "Beans", "Bicarbonate Soda", "Breadcrumbs", "Brown sauce", "Canned tomatoes", "Chutney", "Cinnamon", "Coconut milk", "Cornflour", "Cranberry sauce", "Dip", "Gravy", "Hazelnuts", "Hot sauce", "Icing sugar", "Ketchup", "Lentils", "Maple syrup", "Marmite", "Mashed potatoes", "Mayonnaise", "Mustard", "Nuts", "Oil", "Olive oil", "Oregano", "Paprika", "Pasta sauce", "Peanut butter", "Peppercorns", "Pickle", "Pine nuts", "Rosemary", "Salad dressing", "Salt", "Soy sauce", "Stock", "Sugar", "Tomato puree", "Tomato sauce", "Vanilla sugar", "Vinegar", "Walnuts", "Yeast"],
             "Frozen & Convenience": ["Baked beans", "Burritos", "Chicken wings", "Chinese food", "Chips", "Dumplings", "Fish fingers", "Frozen vegetables", "Ice cream", "Pizza"],
             "Grain Products": ["Basmati rice", "Cereal", "Chickpeas", "Corn flakes", "Couscous", "Flour", "Muesli", "Noodles", "Oatmeal", "Pasta", "Penne", "Rice", "Risotto rice", "Semolina", "Spaghetti", "Tofu"],
             "Snacks & Sweets": ["Biscuits", "Cake", "Chewing gum", "Chocolate", "Christmas cookies", "Crackers", "Crisps", "Custard", "Dessert", "Dried fruits", "Gingerbread", "Honey", "Jam", "Jelly", "Lemon curd", "Marshmallows", "Nougat cream", "Peanuts", "Pop corn", "Pretzels", "Snacks", "Sweets", "Tortilla chips"],
             "Beverage & Tobacco": ["Ale", "Apple juice", "Beer", "Beverages", "Bottled water", "Champagne", "Cider", "Cigarettes", "Coffe", "Cola", "Diet Cola", "Diet soda", "Energy drink", "Fruit juice", "Gin", "Ginger Ale", "Hot chocolate", "Iced tea", "Orange juice", "Prosecco", "Red wine", "Rum", "Smoothie", "Soda", "Spirits", "Sports drink", "Tea", "Tonic water", "Vodka", "Water", "Whisky", "White wine"],
             "Household & Health": ["Aluminium foil", "Baby food", "Bathroom cleaner", "Batteries", "Body lotion", "Candles", "Charcoal", "Cleaning supplies", "Cling film", "Conditioner", "Cotton pads", "Cotton swabs", "Dental floss", "Deodorant", "Dishwater salt", "Dishwater tabs", "Fabric softener", "Face cream", "Facial tissues", "Flowers", "Glass cleaner", "Hair gel", "Hair spray", "Hand cream", "Insect repellent", "Laundry detergent", "Light bulb", "Makeup remover", "Mouthwash", "Nail polish", "Nail polish remove", "Napkins", "Nappies", "Painkiller", "Paper towels", "Razor", "Razor blades", "Shampoo", "Shaving cream", "Shower gel", "Soap", "Sponge", "Sunscreen", "Tampons", "Tissues", "Toilet cleaner", "Toilet paper", "Tootbrush", "Toothpaste", "Vitamins", "Washing-up liquid", "Wrapping paper"],
             "Pet Supplies": ["Bird food", "Cat food", "Cat litter", "Cat treats", "Dog food", "Dog treats", "Fish food"],
             };
        // this._createService.createFirebaseCatalog(catalog);
    }
    ngOnDestroy() {
        // this.reqSubscribe.unsubscribe();
    }

    // create shoppingList
    CreateList() {
        console.log(this.model);
        // this.model.users.push(this.model.email);
        // this.model.users.push(this.initialEmail);
        this.array=[];
        this.inviteUsers=JSON.parse(JSON.stringify(this.users));
        if (this.initialEmail && this.initialEmail!=""){
            this.inviteUsers.push(this.initialEmail);
        }
        this.inviteUsers.push(this.model.email);
        console.log(this.inviteUsers);
        this.CheckUsers();
    }

    // add inviteUsers
    addInvitedUsers() {
        this.users.push('');
    }
    // angular2 pipe for filtering in ui
    customTrackBy(index: number, obj: any): any {
        return index;
    }
    // item not exists
    ItemNotIn(obj){
        let exists=this.exists.filter(function(item){
            return item.email === obj.email;
        });
        if (exists && exists.length>0){
            return false;
        } else {
            return true;
        }
    }
    // check if users exists and edit shoppingList and save users
    CheckUsers() {
        let self=this;
        self.emailedUsers=[];
        for (let i=0;i<this.inviteUsers.length;i++){
            if (this.inviteUsers && this.inviteUsers[i]!=""){
                let obj={
                    email:this.inviteUsers[i]
                }
                self.array.push(obj);
            }
        }
        
        this.model.isFinished=false;
        let sListTemp:list =this.model;
        sListTemp.users=[];
        let sListCreated$=self._createService.createSList(sListTemp);
        sListCreated$.subscribe(x=>{
            this.sList=x;
            this.sListKey=x.$key;
        });
        self._createService.resetSList();
        
        let request$=Observable.from(this.array)
                .mergeMap(data=>{
                    return this.addIfnotExists(data);
                })
                .mergeMap(data=>{
                    return this.getUserObjs(data);
                })
                .map(data=>{
                    this.createSListUser(data);
                    return this.sendKeys(data);
                });
                // .map(data=>{
                //     this.sendEmail(data);
                //     return this.sendKeys(data);
                // });
                
        this.reqSubscribe=request$.subscribe(
                val=>{
                    if (val){
                        self.emailedUsers.push(val);
                        if (self.emailedUsers.length == self.inviteUsers.length)
                        {
                            if (self.sList) 
                            {
                                let userEmailKey=self.emailedUsers.find(self.findUserEmailKey,self);
                                self.router.navigate([`list/${self.sListKey}`,{email:userEmailKey.$key}])
                            }
                        }
                    }
                    console.log(val);
                }
            );
        // if (!window.navigator.onLine)
        // {
        //     self.snackBar.open('Shopping List will be Created and email will be sent, once device comes online, Don\'t close the Browser', 'Okay');
        // }
        
    }

    // find user email by key
    findUserEmailKey(item:any):boolean{
        return item.email==this.model.email;
    }

    // send email by keys
    sendKeys(data: any):Observable<any>{
        return data;
    }
    sendEmail(usr:any):void{
        if (usr){
            this._createService.sendEmailToUser(usr);
        }
    }
    // create shopping list user
    createSListUser(usr) : void{
        if (usr){
            this._createService.createSListUser(usr);
            console.log(usr);
        }
    }

    // get users 
    getUserObjs(usr:user):Observable<user>{
        var self=this;
        return self._createService.getItemFromFirebase(usr.email)
            .map(x=>x);
    }
    // add if users not exists
    addIfnotExists(usr:user):Observable<user> {
        var self=this;
        let exists=self.usersFirebase.filter((item)=>item.email==usr.email);
        if (exists && exists.length>0){}
        else{
            self._createService.addtoFirebase(usr);
        }
        let arr=[];
        arr.push(usr);
        return Observable.from(arr);
    }
    // get users
    getUsers() {
        this._createService.getUsersFirebase()
            .subscribe(
                
            users => {
                this.usersFirebase = users;    
        }, //Bind to view
            err => {
                // Log errors if any
                console.log(err);
            });
    }

}