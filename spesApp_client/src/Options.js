import {
  Avatar,
  Button,
  Card,
  IconButton,
  Modal,
  Portal,
  TextInput,
} from "react-native-paper";
import React, { useState, useEffect } from "react";
import { colors } from "./Colors";
export default function Options(props) {
  const [visible, setVisible] = useState(props.info);
  const [weeklySpend, setWeeklySpend] = useState(props.options.weeklySpend);
  const [weeklyShopping, setWeeklyShopping] = useState(
    props.options.weeklyShopping
  );
  const setInfo = props.setInfo;

  useEffect(() => {
    setVisible(props.info);
  }, [props.info]);

  const Add = () => {
    const options = {
      weeklySpend,
      weeklyShopping,
    };

    props.setOptions({ ...options });
  };

  return (
    <>
      <Portal>
        <Modal
          visible={visible}
          dismissable={false}
          contentContainerStyle={{ padding: 0, margin: 20 }}
        >
          <Card>
            <Card.Title
              title={"User Settings"}
              left={(props) => <Avatar.Icon {...props} icon="account" />}
              right={(props) => (
                <IconButton
                  {...props}
                  icon="close"
                  onPress={() => {
                    setInfo("");
                  }}
                />
              )}
              subtitle={"Set your preferences!"}
            />
            <Card.Content style={{ marginTop: 8, marginBottom: 8 }}>
              <TextInput
                keyboardType="numeric"
                style={{ marginBottom: 8 }}
                placeholder={props.options.weeklySpend.toString()}
                label={"How much you spend weekly?"}
                onChangeText={(text) => {
                  if (!parseFloat(text) || isNaN(parseFloat(text)))
                    text = props.options.weeklySpend;
                  if (text.length < 20)
                    setWeeklySpend(
                      parseFloat(text.replace(",", ".")).toFixed(2)
                    );
                }}
              />
              <TextInput
                keyboardType="numeric"
                style={{ marginBottom: 8 }}
                placeholder={props.options.weeklyShopping.toString()}
                label={"How many times you go shopping?"}
                onChangeText={(text) => {
                  if (!parseFloat(text) || isNaN(parseFloat(text)))
                    text = props.options.weeklyShopping;
                  if (text.length < 20)
                    setWeeklyShopping(
                      parseFloat(text.replace(",", ".")).toFixed(2)
                    );
                }}
              />
            </Card.Content>
            <Card.Actions>
              <Button
                style={{ width: "96%", marginLeft: "2%", marginRight: "2%" }}
                icon={"content-save"}
                mode={"contained"}
                color={colors.primary}
                onPress={() => {
                  Add();
                  props.setInfo("");
                }}
              />
            </Card.Actions>
          </Card>
        </Modal>
      </Portal>
    </>
  );
}
