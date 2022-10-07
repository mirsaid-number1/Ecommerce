import React,{useState} from 'react'
import { Icon } from '@iconify/react';
import {db,collectionProducts} from '../context/firebase'
import {doc,setDoc,getDoc} from 'firebase/firestore'
function Star() {
    let [stars,setStars] = useState([{s:'true'},{s:'false'},{s:'false'},{s:'false'},{s:'false'}])
    let [block, setBlock] = useState(false);
    let productIDs = ['1','2','3','4'];
    let resProducts = [];

    for(let i of productIDs) {
        let productDoc = doc(db,'products',i);
        getDoc(productDoc).then(item => {
            resProducts.push({...item.data(),productID:item.id})
        })
    }
    
    console.log(resProducts)

    // function highlightStar(id) {
        
    //     if(block){
    //         return
    //     }

    //     let arr = stars.map((item,index) => index <= id ? item = {s:'true'} : {s:'false'}
    //     );

    //     setStars(arr);
    //     console.log(arr)
    // }

    // function setStar(id){
    //      let arr = stars.map((item,index) => index <= id ? item = {s:'true'} : {s:'false'}
    //     );

    //     setStars(arr);
    //     setBlock(true)
    // }
    
    // function setProduct() {
    //     let productDir = doc(db,'products','17');
    //     setDoc(productDir,{
    //         brand:'under armour',
    //         name:`UNDER ARMOUR Armour Surge 3 Mens Trainers`,
    //         description:`The Under Armour Surge 3 Mens Trainers are a great addition to your casual wardrobe, crafted with a low profile ankle collar, along with a cushioned insole and a lace closure that ensures a secure and comfortable fit for all day wear. A knitted upper increases breathability and a contrasting outsole with the Under Armour branding to the side completes the casual look.`,
    //         type:'ordinary',
    //         price:37,
    //         old_price:44.99,
    //         main_img:`https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackGreyRed%2FBlackRed%205.jpg?alt=media&token=5490bab7-664f-469b-b1b4-38753bd4a2f4`,
    //         productInfo:[
    //             {key:'Shown',value:'Black Black/Grey/Red Black/White Blue/White'},
    //             {key:'Style',value:'Runners'},
    //             // {key:'Surface',value:'Road'},
    //             // {key:'Collection',value:'Skechers'},
    //             {key:'Fastenings',value:'Lace up'},
    //             // {key:"sole Technologies",   value:"Eva Insole"},
    //             // {key:'Weatherproof', value:'Waterproof'},
    //             {key:'Upper Material', value:'Textile'},
    //             {key:"InSole Technologies", value:'Cushioned Insole'},
    //             {key:'Sole',value:'Rubber Sole'}
    //             // {key:'Midsole', value:'AmpliFoam'}
    //         ],
    //         img:[
    //             {
    //                 colorName:'black',
    //                 imgs:[
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2Fblack%2FBlack%201.jpg?alt=media&token=b094d62c-4b43-4207-9df2-467f3da209ed`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2Fblack%2FBlack%202.webp?alt=media&token=1c353613-cf2e-41fb-b003-baff7fa0bf85`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2Fblack%2FBlack%203.jpg?alt=media&token=1ceb1eac-878c-473b-9ff2-996ab48102f6`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2Fblack%2FBlack%204.jpg?alt=media&token=7ba2ad6b-8fd0-4735-8fa6-57512d70db73`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2Fblack%2FBlack%205.jpg?alt=media&token=008c7188-3f08-4357-82b0-77c7c4a72401`
    //                 ]
    //             },
    //             {
    //                 colorName:'black/grey/red',
    //                 imgs:[
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackGreyRed%2FBlackRed%201.jpg?alt=media&token=9c404fa7-d06a-4655-9575-a08e9b84e841`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackGreyRed%2FBlackRed%202.webp?alt=media&token=5afaa090-d50d-4622-8c40-3197ac3cca8f`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackGreyRed%2FBlackRed%203.jpg?alt=media&token=c4aa2947-4c27-4b14-9e08-27d902edadc7`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackGreyRed%2FBlackRed%204.jpg?alt=media&token=0dcaf9d3-c019-4635-b861-789cd7da3b52`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackGreyRed%2FBlackRed%205.jpg?alt=media&token=5490bab7-664f-469b-b1b4-38753bd4a2f4`
    //                 ]
    //             },
    //             {
    //                 colorName:'black/white',
    //                 imgs:[
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackWhite%2FBlackWhite%201.webp?alt=media&token=95ceefa3-f7fe-4c1f-8fda-e21fc60ee216`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackWhite%2FBlackWhite%202.webp?alt=media&token=05feb86c-c301-4284-a961-dfd101761143`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackWhite%2FBlackWhite%203.jpg?alt=media&token=de801470-d679-49ce-83ce-81072a84e8d4`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackWhite%2FBlackWhite%204.jpg?alt=media&token=50fc05c2-9f7d-4f76-8b93-86507f6a6e2b`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackWhite%2FBlackWhite%205.jpg?alt=media&token=a9029fdb-3538-48ee-992b-d2a6e5833c4d`
                        
    //                 ]
    //             },
    //             {
    //                 colorName:'blue/white',
    //                 imgs:[
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblueWhite%2FBlueWhite%201.webp?alt=media&token=1933e0c8-b16d-4581-8189-1034e7468bdd`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblueWhite%2FBlueWhite%202.webp?alt=media&token=6841eaff-8129-451f-b185-4ce685d2d041`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblueWhite%2FBlueWhite%203.jpg?alt=media&token=41ca7285-79cb-4a43-9c86-653d9f4338aa`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblueWhite%2FBlueWhite%204.jpg?alt=media&token=e7d19c87-9b5f-4112-95e5-1a3fa9ef323d`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblueWhite%2FBlueWhite%205.jpg?alt=media&token=bfe9293f-13d9-46e0-85f6-83520af5814a`
    //                 ]
    //             },
    //             // {
    //             //     colorName:'black/white',
    //             //     imgs:[
    //             //         `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FASICS%20GEL-Contend%207%20Men's%20Running%20Shoes%201%2FblackWhite%2FBlackWhite%201.webp?alt=media&token=5e10aee2-69b3-4446-a84b-e3cb276ed548`,
    //             //         `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FASICS%20GEL-Contend%207%20Men's%20Running%20Shoes%201%2FblackWhite%2FBlackWhite%202.webp?alt=media&token=d1c29fa6-91bd-43cd-ac95-e88a4166fd1d`,
    //             //         `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FASICS%20GEL-Contend%207%20Men's%20Running%20Shoes%201%2FblackWhite%2FBlackWhite%203.jpg?alt=media&token=eecefb5f-88ce-4c32-96bb-81ad14a8c5a2`,
    //             //         `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FASICS%20GEL-Contend%207%20Men's%20Running%20Shoes%201%2FblackWhite%2FBlackWhite%204.jpg?alt=media&token=1d03dd0e-b68a-457f-8c39-ade2bcc2fd73`,
    //             //         `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FASICS%20GEL-Contend%207%20Men's%20Running%20Shoes%201%2FblackWhite%2FBlackWhite%205.jpg?alt=media&token=e15f4085-1fe3-4870-a92e-183bedcf427d`,
    //             //         `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FASICS%20GEL-Contend%207%20Men's%20Running%20Shoes%201%2FblackWhite%2FBlackWhite%206.webp?alt=media&token=ae83559d-6230-484d-be6a-e5a1d1dfdd2e`,
    //             //         `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FASICS%20GEL-Contend%207%20Men's%20Running%20Shoes%201%2FblackWhite%2FBlackWhite%207.jpg?alt=media&token=70f8afe3-a9c8-4a08-bae2-ef0d68659c20`
                        
    //             //     ]
    //             // }
    //         ],
    //         rating:{
    //             users:[
    //             {uid:'rQx70RPClzN7PB7javygIgPnDsz1',mark:5},
    //             {uid:'3ghIjUitrfPW3S6Kq5KF9ByZyQo2',mark:5},
    //             {uid:'5JxCgfjh1Lc9oqR3sQyzbUrHtwX2',mark:5},
    //             {uid:'U8gkQuoOIPYEyO8JAGilomc9IsV2',mark:4},
    //             ],
    //             stars:19},
    //         likee:{users:[
    //             '3ghIjUitrfPW3S6Kq5KF9ByZyQo2',
    //             '5JxCgfjh1Lc9oqR3sQyzbUrHtwX2',
    //             'U8gkQuoOIPYEyO8JAGilomc9IsV2'
    //         ],likes:4},
    //         comments:[
    //             {
    //                 userImg:'https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/166196135371220220724_140553.jpg?alt=media&token=27d01bbd-e15d-47b4-ad6b-91427a3e3ed6',
    //                 name:'Adam',
    //                 rating:5,
    //                 comment:'From my experience, I can say that Under Armour is very good trainer.Once I bought it till now quality is not dwindled.',
    //                 timeStamp:'September 3, 2022',
    //                 productImgs:[
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackWhite%2FBlackWhite%202.webp?alt=media&token=05feb86c-c301-4284-a961-dfd101761143`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackWhite%2FBlackWhite%203.jpg?alt=media&token=de801470-d679-49ce-83ce-81072a84e8d4`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackWhite%2FBlackWhite%204.jpg?alt=media&token=50fc05c2-9f7d-4f76-8b93-86507f6a6e2b`,
    //                 ]
    //             },
    //             {
    //                 userImg:'https://lh3.googleusercontent.com/a-/AFdZucrvDJfQvyEljUJpwoECrQaehsFqdeO7et033ezn=s96-c',
    //                 name:'Mirsaid Mirakhmedov',
    //                 rating:5,
    //                 comment:'Very good brand, I saw so many people wearing trainers from this brand.',
    //                 timeStamp:'September 3, 2022',
    //                 productImgs:[
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblueWhite%2FBlueWhite%201.webp?alt=media&token=1933e0c8-b16d-4581-8189-1034e7468bdd`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblueWhite%2FBlueWhite%202.webp?alt=media&token=6841eaff-8129-451f-b185-4ce685d2d041`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblueWhite%2FBlueWhite%203.jpg?alt=media&token=41ca7285-79cb-4a43-9c86-653d9f4338aa`,
    //                 ]
    //             },
    //             {
    //                 userImg:'https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/1661962944056photo_2022-08-31_14-05-12.jpg?alt=media&token=291fa413-8acb-4932-815b-846964eed19b',
    //                 name:'Triple_MMM',
    //                 rating:5,
    //                 comment:'It has nice looking. I mead a decision one of this, right now lets go.',
    //                 timeStamp:'September 3, 2022',
    //                 productImgs:[
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackGreyRed%2FBlackRed%203.jpg?alt=media&token=c4aa2947-4c27-4b14-9e08-27d902edadc7`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackGreyRed%2FBlackRed%204.jpg?alt=media&token=0dcaf9d3-c019-4635-b861-789cd7da3b52`,
    //                     `https://firebasestorage.googleapis.com/v0/b/e-commerce-b8423.appspot.com/o/products%2FUNDER%20ARMOUR%20Armour%20Surge%203%20Mens%20Trainers%202%2FblackGreyRed%2FBlackRed%205.jpg?alt=media&token=5490bab7-664f-469b-b1b4-38753bd4a2f4`
    //                 ]
    //             },
    //         ]
    //     }).then(res => {
    //         console.log(res)
    //     }).catch(err => console.log(err));
    // }
  
    return (<>
        <div className='star_rating'>
        
        {/* <button className='star1' style={{color:'yellow'}} onMouseOver={() => highlightStar(0)} onClick={() => setStar(0)}>
        <Icon icon="ant-design:star-filled" color={stars[0].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
        </button>  
        <button className='star1' style={{color:'yellow'}} onMouseOver={() => highlightStar(1)} onClick={() => setStar(1)}>
        <Icon icon="ant-design:star-filled" color={stars[1].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
        </button>
        <button className='star1' style={{color:'yellow'}} onMouseOver={() => highlightStar(2)} onClick={() => setStar(2)}>
        <Icon icon="ant-design:star-filled" color={stars[2].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
        </button>
        <button className='star1' style={{color:'yellow'}} onMouseOver={() => highlightStar(3)} onClick={() => setStar(3)}>
        <Icon icon="ant-design:star-filled" color={stars[3].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
        </button>
        <button className='star1' style={{color:'yellow'}} onMouseOver={() => highlightStar(4)} onClick={() => setStar(4)}>
        <Icon icon="ant-design:star-filled" color={stars[4].s == 'true' ? 'gold' : "#c1c8ce"} width="25" height="25" />
        </button> */}
        </div>
        {/* <button onClick={setProduct} style={{margin:'0 auto'}}>setData to there I love indian accent!!!</button> */}
    </>)
}

export default Star