function showPicture()
         {

            var x=''
            var y=''
            var z=''
             if(product1.checked)
                  {
                        x=product1.value
                        fp1.width=100
                        fp1.height=40
                        fp1.src=`/images/${x}.png`
                  }
                  else
                  {
                        x=''
                        fp1.src=`${x}`
                  }
             if(product2.checked)
                  {
                        y=product2.value
                        fp2.width=100
                        fp2.height=40
                        fp2.src=`/images/${y}.png`
                  }
                  else
                  {
                        y=''
                        fp2.src=`${y}`
                  }
             if(product3.checked)
                  {
                        z=product3.value
                        fp3.width=100
                        fp3.height=40
                        fp3.src=`/images/${z}.png`
                  }
                  else
                  {
                        z=''                 
                        fp3.src=`${z}`
                  }
         }


         $(document).ready(function(){

            $.get('/supply/fill_state',function(response){
                  response.data.map((item)=>{
                        $('#stateid').append($('<option>').text(item.statename).val(item.stateid))
                  })
                  
            })
               
            $('#stateid').change(function(){
                     
                  $.get('/supply/fill_city',{stateid:$('#stateid').val()},function(response){
                        
                        $('#cityid').empty()
                        $('#cityid').append($('<option>').text('Select City'))
                        
                        response.data.map((item)=>{
                              $('#cityid').append($('<option>').text(item.cityname).val(item.cityid))
                        })
                  
                  })
            })


         })