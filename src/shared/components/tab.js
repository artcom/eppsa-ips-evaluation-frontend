import styled from "styled-components"


const Tab = styled.div`
  font-size: 1.5em;
  padding: 0.5em;
  background-color: ${props => props.highlight
    ? "#F6F7F7"
    : "#BFBFBF"
  };
`

export default Tab

Tab.defaultProps = {
  highlight: false
}
