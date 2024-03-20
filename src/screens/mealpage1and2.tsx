{mealItems1.length > 0 ? (
    <Block
      radius={sizes.sm}
      shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
      marginTop={sizes.s}
      card
      color="#f5e8fa">
      <Block row align="center">
        <Block flex={0}>
          <Image
            source={require('../assets/icons/meal.png')}
            style={{
              width: sizes.xl,
              height: sizes.xl,
            }}
            marginLeft={sizes.s}
          />
        </Block>
        <Block flex={3} style={{alignSelf: 'center'}}>
          {mealItems1.length > 1 ? (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('meal1', {
                  mealType: 'meal1',
                  meal_type: 7,
                  data,
                  formDataCopy,
                });
              }}>
              <Text p black semibold center padding={10}>
                {' '}
                Meals 1 ({totalMeal1Calorie}) kcal
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('meal1', {
                  mealType: 'meal1',
                  meal_type: 7,
                  data,
                  formDataCopy,
                });
              }}>
              <Text p black semibold center padding={10}>
                Meal 1 ({totalMeal1Calorie}) kcal
              </Text>
            </TouchableOpacity>
          )}

          <Block row flex={0} align="center" justify="center">
            <Block
              flex={0}
              height={1}
              width="50%"
              end={[1, 0]}
              start={[0, 1]}
              gradient={gradients.divider}
            />
            <Text center marginHorizontal={sizes.s}></Text>
            <Block
              flex={0}
              height={1}
              width="50%"
              end={[0, 1]}
              start={[1, 0]}
              gradient={gradients.divider}
            />
          </Block>
        </Block>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('searchfood', {
              mealType: 'meal1',
              meal_type: 7,
              data,
              formDataCopy,
            })
          }>
          <Block flex={0} style={{alignSelf: 'center'}}>
            <Image
              radius={0}
              width={25}
              height={25}
              color={'#c58bf2'}
              source={assets.plus}
              transform={[{rotate: '360deg'}]}
              margin={sizes.s}
            />
          </Block>
        </TouchableOpacity>
      </Block>

      <Block flex={1} center>
        <DataTable style={styles.container}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Cell
              style={{flex: 1.4}}></DataTable.Cell>
            <DataTable.Cell style={{flex: 1.3}}>
            Protein
            </DataTable.Cell>
            <DataTable.Cell style={{flex: 1.3}}>
              Carb
            </DataTable.Cell>
            <DataTable.Cell>Fat</DataTable.Cell>
            <DataTable.Cell>KCAL</DataTable.Cell>
            <DataTable.Cell></DataTable.Cell>
          </DataTable.Header>
          {mealItems1.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell
                style={{flex: 1.4}}
                numberOfLines={
                  expandedItems.includes(index) ? 0 : 1
                }>
                {item.food_name}
              </DataTable.Cell>
              <DataTable.Cell style={{flex: 1.3}}>
                {item.details.totalProtein}
              </DataTable.Cell>
              <DataTable.Cell style={{flex: 1.3}}>
                {item.details.totalCarb}
              </DataTable.Cell>
              <DataTable.Cell>
                {item.details.totalFat}
              </DataTable.Cell>
              <DataTable.Cell>
                {item.details.totalCalorie}
              </DataTable.Cell>
              <DataTable.Cell
                style={{
                  alignSelf: 'center',
                  justifyContent: 'flex-end',
                }}>
                {' '}
                <TouchableOpacity
                  onPress={() => {
                    handleDelete(index, 'meal1');
                    handleDeleteApi(item);
                  }}>
                  <Image
                    source={require('../assets/icons/close1.png')}
                    color={'#fa9579'}
                    style={
                      (styles.data,
                      {
                        width: 20,
                        height: 20,
                        alignContent: 'center',
                      })
                    }
                    margin={sizes.s}
                  />
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Block>
    </Block>
  ) : (
    <Block
      flex={0}
      radius={sizes.sm}
      shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
      marginTop={sizes.m}
      marginHorizontal={10}
      card
      color="rgb(245,232,250)"
      center>
      <Block row align="center">
        <Block flex={0}>
          <Image
            source={require('../assets/icons/meal.png')}
            style={{
              width: sizes.xl,
              height: sizes.xl,
            }}
            marginLeft={sizes.s}
          />
        </Block>
        <Block flex={3} style={{alignSelf: 'center'}}>
          <Text
            p
            black
            semibold
            center
            padding={10}
            onPress={() =>
              navigation.navigate('searchfood', {
                mealType: 'meal1',
                meal_type: 7,
                formDataCopy,
                data,
              })
            }>
            Add Meal 1
          </Text>
        </Block>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('searchfood', {
              mealType: 'meal1',
              meal_type: 7,
              formDataCopy,
              data,
            })
          }>
          <Block flex={0} style={{alignSelf: 'center'}}>
            <Image
              radius={0}
              width={25}
              height={25}
              color={'#c58bf2'}
              source={assets.plus}
              transform={[{rotate: '360deg'}]}
              margin={sizes.s}
            />
          </Block>
        </TouchableOpacity>
      </Block>
    </Block>
  )}
  {mealItems2.length > 0 ? (
    <Block
      radius={sizes.sm}
      shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
      marginTop={sizes.s}
      card
      color="#f5e8fa">
      <Block row align="center">
        <Block flex={0}>
          <Image
            source={require('../assets/icons/meal2.png')}
            style={{
              width: sizes.xl,
              height: sizes.xl,
            }}
            marginLeft={sizes.s}
          />
        </Block>
        <Block flex={3} style={{alignSelf: 'center'}}>
          {mealItems1.length > 1 ? (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('meal2', {
                  mealType: 'meal2',
                  meal_type: 8,
                  data,
                  formDataCopy,
                })
              }>
              <Text p black semibold center padding={10}>
                {' '}
                Meals 2 ({totalMeal2Calorie}) kcal
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('meal2', {
                  mealType: 'meal2',
                  meal_type: 8,
                  data,
                  formDataCopy,
                })
              }>
              <Text p black semibold center padding={10}>
                Meal 2 ({totalMeal2Calorie}) kcal
              </Text>
            </TouchableOpacity>
          )}

          <Block
            row
            flex={0}
            align="center"
            justify="center"
            paddingBottom={0}>
            <Block
              flex={0}
              height={1}
              width="50%"
              end={[1, 0]}
              start={[0, 1]}
              gradient={gradients.divider}
            />
            <Text center marginHorizontal={sizes.s}></Text>
            <Block
              flex={0}
              height={1}
              width="50%"
              end={[0, 1]}
              start={[1, 0]}
              gradient={gradients.divider}
            />
          </Block>
        </Block>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('searchfood', {
              mealType: 'meal2',
              meal_type: 8,
              formDataCopy,
              data,
            })
          }>
          <Block flex={0} style={{alignSelf: 'center'}}>
            <Image
              radius={0}
              width={25}
              height={25}
              color={'#c58bf2'}
              source={assets.plus}
              transform={[{rotate: '360deg'}]}
              margin={sizes.s}
            />
          </Block>
        </TouchableOpacity>
      </Block>

      {/* testing  */}
      <Block flex={1} center>
        <DataTable style={styles.container}>
          <DataTable.Header style={styles.tableHeader}>
            <DataTable.Cell
              style={{flex: 1.4}}></DataTable.Cell>
            <DataTable.Cell style={{flex: 1.3}}>
            Protein
            </DataTable.Cell>
            <DataTable.Cell style={{flex: 1.3}}>
              Carb
            </DataTable.Cell>
            <DataTable.Cell>Fat</DataTable.Cell>
            <DataTable.Cell>KCAL</DataTable.Cell>
            <DataTable.Cell></DataTable.Cell>
          </DataTable.Header>
          {mealItems2.map((item, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell
                style={{flex: 1.4}}
                numberOfLines={
                  expandedItems.includes(index) ? 0 : 1
                }>
                {item.food_name}
              </DataTable.Cell>
              <DataTable.Cell style={{flex: 1.3}}>
                {item.details.totalProtein}
              </DataTable.Cell>
              <DataTable.Cell style={{flex: 1.3}}>
                {item.details.totalCarb}
              </DataTable.Cell>
              <DataTable.Cell>
                {item.details.totalFat}
              </DataTable.Cell>
              <DataTable.Cell>
                {item.details.totalCalorie}
              </DataTable.Cell>
              <DataTable.Cell
                style={{
                  alignSelf: 'center',
                  justifyContent: 'flex-end',
                }}>
                {' '}
                <TouchableOpacity
                  onPress={() => {
                    handleDelete(index, 'meal2');
                    handleDeleteApi(item);
                  }}>
                  <Image
                    source={require('../assets/icons/close1.png')}
                    color={'#fa9579'}
                    style={
                      (styles.data,
                      {
                        width: 20,
                        height: 20,
                        alignContent: 'center',
                      })
                    }
                    margin={sizes.s}
                  />
                </TouchableOpacity>
              </DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Block>

      {/* test ends  */}
    </Block>
  ) : (
    <Block
      flex={0}
      radius={sizes.sm}
      shadow={!isAndroid} // disabled shadow on Android due to blur overlay + elevation issue
      marginTop={sizes.m}
      marginHorizontal={10}
      card
      color="rgb(245,232,250)"
      center>
      <Block row align="center">
        <Block flex={0}>
          <Image
            source={require('../assets/icons/meal2.png')}
            style={{
              width: sizes.xl,
              height: sizes.xl,
            }}
            marginLeft={sizes.s}
          />
        </Block>
        <Block flex={3} style={{alignSelf: 'center'}}>
          <Text
            p
            black
            semibold
            center
            padding={10}
            onPress={() =>
              navigation.navigate('searchfood', {
                mealType: 'meal2',
                meal_type: 8,
                formDataCopy,
                data,
              })
            }>
            Add Meal 2
          </Text>
        </Block>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('searchfood', {
              mealType: 'meal2',
              meal_type: 8,
              formDataCopy,
              data,
            })
          }>
          <Block flex={0} style={{alignSelf: 'center'}}>
            <Image
              radius={0}
              width={25}
              height={25}
              color={'#c58bf2'}
              source={assets.plus}
              transform={[{rotate: '360deg'}]}
              margin={sizes.s}
            />
          </Block>
        </TouchableOpacity>
      </Block>
    </Block>
  )}