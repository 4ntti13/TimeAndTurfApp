/* eslint-disable prettier/prettier */
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { View, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';

type WorksiteDetailsRouteProp = RouteProp<RootStackParamList, 'WorksiteDetails'>;

type Props = {
  route: WorksiteDetailsRouteProp;
};

const WorksiteDetails: React.FC<Props> = ({ route }) => {
  const { customer, worksite } = route.params;

  const [selectedTool, setSelectedTool] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState('');
  const [tools, setTools] = useState<any[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [workHours, setWorkHours] = useState(0);
  const [workMinutes, setWorkMinutes] = useState(0);

  // Luo valitsimet työtunneille ja -minuuteille
  const workHoursItems = Array.from({ length: 25 }).map((_, i) => ({
    label: `${i} h`,
    value: i,
  }));
  const workMinutesItems = Array.from({ length: 60 }).map((_, i) => ({
    label: `${i} min`,
    value: i,
  }));

  useEffect(() => {
    const fetchTools = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'tools'));
      setTools(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    const fetchMaterials = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'materials'));
      setMaterials(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    };

    fetchTools();
    fetchMaterials();
  }, []);

  const handleToolChange = (tool: any) => {
    setSelectedTool(tool);
  };

  const handleMaterialChange = (material: any) => {
    setSelectedMaterial(material);
  };

  return (
    <View>
      <Text>Valittu asiakas: {customer.name}</Text>
      <Text>Valittu työmaa: {worksite.name}</Text>

      <Text>Työtunnit:</Text>
      <Picker
        selectedValue={workHours}
        onValueChange={(value) => setWorkHours(value)}
      >
        {workHoursItems.map((item) => (
          <Picker.Item label={item.label} value={item.value} key={item.value.toString()} />
        ))}
      </Picker>

      <Text>Minuutit:</Text>
      <Picker
        selectedValue={workMinutes}
        onValueChange={(value) => setWorkMinutes(value)}
      >
        {workMinutesItems.map((item) => (
          <Picker.Item label={item.label} value={item.value} key={item.value.toString()} />
        ))}
      </Picker>

      <Text>Valitse laite:</Text>
      <Picker
        selectedValue={selectedTool}
        onValueChange={handleToolChange}
      >
        {tools.map((tool) => (
          <Picker.Item label={tool.name} value={tool.id} key={tool.id} />
        ))}
      </Picker>

      <Text>Valitse materiaali:</Text>
      <Picker
        selectedValue={selectedMaterial}
        onValueChange={handleMaterialChange}
      >
        {materials.map((material) => (
          <Picker.Item label={material.name} value={material.id} key={material.id} />
        ))}
      </Picker>
    </View>
  );
};

export default WorksiteDetails;
