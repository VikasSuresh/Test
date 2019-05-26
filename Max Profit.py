tname=''
ttime=[5,4,10]
tprice=[1500,1000,3000]
t=20
result=[0,0,0]
tres=0
'''recursing function to find the max profit'''
def recurs(temp,i):    
    tempres=[]
    tlist=[]
    if len(i) ==0:
        return 0
    for j in ttime:
            if(j<temp):
                tempres.append((temp-j)*tprice[ttime.index(j)])
            else:
                tempres.append(0)
    maxtempres=max(tempres)   
    itemp=tempres.index(maxtempres)
    global tres
    tres+=maxtempres
    temp-=ttime[itemp]
    global tname
    tname+=str(itemp)
    for i in i:
        if i<temp:
            tlist.append(i)                
    recurs(temp,tlist)

    ''' main '''
for i in range(0,len(ttime)):
    temp=t
    tlist=[]
    if ttime[i]<temp:
        temp-=ttime[i]
        tres=temp*tprice[i]
        for j in ttime:
            if j<temp:
                tlist.append(j)
        tname+=str(i)
        recurs(temp,tlist)       
        result[i]=tres
        tname+='-'
tname=tname.split('-')
''' Printing the Output '''
maxi=max(result)

ttemp=[]
for i in range(0,len(result)):    
    tres=[0,0,0]
    if maxi==result[i]:
        for j in tname[i]:
            if(j=='0'):
                tres[0]+=1
            elif(j=='1'):
                tres[1]+=1
            elif(j=='2'):
                tres[2]+=1
        ttemp.append('T :'+str(tres[0])+' P :'+str(tres[1])+' C :'+str(tres[2]))
    
print(max(result))
print(ttemp)